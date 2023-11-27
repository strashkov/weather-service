## Getting Started

1. Setup node:

```sh
nvm use
```

2. Install the dependencies:

```sh
npm install -g npm && npm install
```

3. Run the docker containers:

```sh
docker-compose up
```

4. Set up env:

```sh
mv .env.example .env
```

Obtain API key on https://app.tomorrow.io/ and populate the .env file.

5. Prepare DB:

```sh
npm run db:prepare
```

6. Start the application ad open the documentation:

```sh
npm run build & npm run start & npm run docs
```

7. Local development

```sh
npm run dev
```
