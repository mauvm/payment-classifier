# Payment Classifier

> CLI for classifying Bunq payments, combined with deep learning to make suggestions.

## Setup

First setup directory and install Node dependencies:

```bash
git clone https://github.com/mauvm/payment-classifier
cd payment-classifier

yarn install
```

Then configure project:

```bash
cp .env.example .env
chmod 600 .env
# > Edit .env
```

Finally, run the database migrations:

```bash
yarn knex migrate:latest
```

### Development

Use `ts-node-dev` to run TypeScript and watch for file changes:

```bash
yarn dev
```

Before committing code, run:

```bash
yarn lint
yarn test
```

### Production

Build to ES5 and run:

```bash
yarn build
yarn start
```

## License

See `LICENSE` file.
