
## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```


## 初始化数据库 

1. 创建一个 .env 文件
2. 去supabase.com上创建一个项目，把几个环境变量都填上去， DATABASE_URL 是postgresDB 的 connection string
3. 初始化数据库
```bash
npx prisma db push
npx prisma db generate

```




## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
