import { createParser } from "eventsource-parser";
import mitt, { Emitter } from "mitt";import {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequestFunctionCall,
} from "openai";
import {Buffer} from 'buffer'

type Events = {
  text: string;
  onError: Error;
  init: void;
  onStart: any;
  onUpdate: { delta: string; full_text: string };
  onDone: string;
  onAbort: void;
};

type params = {
  messages: ChatCompletionRequestMessage[];
  func?: CreateChatCompletionRequestFunctionCall;
};
export class AIStreamReader {
  messages: ChatCompletionRequestMessage[];
  func: CreateChatCompletionRequestFunctionCall | undefined;
  text: string;
  event = mitt<Events>();
  fetch: Response | undefined;
   reader?:ReadableStreamDefaultReader;

  constructor(params: params) {
    this.messages = params.messages;
    this.func = params.func;
    this.text = "";
  }

  updateParams(params: params) {
    if (params) {
      this.text = "";
      this.messages = params.messages;
      this.func = params.func;
    }
  }

  async startRead(params?: params) {
    this.text = "";
    if (params) {
      this.messages = params.messages;
      this.func = params.func;
    }
    this.event.emit("init");

    const body = {
        messages: this.messages,
        function_call: this.func,
        apikey: useLocalStorage('apikey','').value
    }
    const response = (this.fetch = await fetch("/api/openai-stream",{
        method:'post',
        body: JSON.stringify(body)
    }));
   
    this.event.emit("onStart", response.body);
    const reader = this.reader = response.body?.getReader();

    
    const parser = createParser((event) => {
      if (event.type === "event") {
        if (event.data == "[DONE]") {
          console.log("done");
          this.event.emit("onDone", this.text);
        }
        try {
          const json = JSON.parse(event.data);
        
          if (!json.choices[0].delta.content) return;
          this.text += json.choices[0].delta.content;
          this.event.emit("onUpdate", {
            delta: json.choices[0].delta.content,
            full_text: this.text,
          });
        } catch (e: any) {
          this.event.emit("onError", Error(e.message));
        }
      }
    });
    while (true) {
      const { value, done } = await reader!.read();
      console.log(value)
      if (done) break;
      parser.feed(Buffer.from(value).toString("utf-8"));
    }
  }

  stopFetch() {
    console.log('stop fetch');
    this.reader?.cancel("user abort");
    this.event.emit("onAbort");
  }
}

export const useReadStream = (params:{
  messages: ChatCompletionRequestMessage[] | any ,
  func?: CreateChatCompletionRequestFunctionCall | any
}
  
) => {
 const value = ref<string>("");
 const loading = ref<boolean>(false);
  const stream = new AIStreamReader({
    messages: toValue(params.messages),
    func: toValue(params.func),
  });
  const event = stream.event;

  stream.event.on('init',()=>{
    loading.value = true
  })
  stream.event.on("onStart", (body) => {
    loading.value = true
  })
  stream.event.on("onDone", (body) => {
    loading.value = false
  })
  stream.event.on("onUpdate", ({ delta, full_text }) => {
    value.value = full_text;
  });
  stream.event.on("onAbort", () => {
    loading.value = false;
  })

  const abort = () => {
    stream.stopFetch();
  };
  const fetch = () => {
    value.value = "";
    stream.startRead();
  };

  watchEffect(()=>{
    stream.updateParams({
      messages: toValue(params.messages),
      func: toValue(params.func),
    })
  })

  return {
    fetch,
    abort,
    stream,
    value,
    loading,
    event
  };
};
