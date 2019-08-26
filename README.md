# Payment Classifier

> CLI for classifying Bunq payments, combined with deep learning to make suggestions.

## Usage

- Setup
- Development
- Training classifier

### Setup

First setup directory and install Node dependencies:

```bash
git clone https://github.com/mauvm/payment-classifier
cd payment-classifier

yarn install
```

1. Use remote MySQL database: create a new database and user.
2. Setup development instance with Docker: configure first and then run `docker-compose up -d`.

Configure the project:

```bash
cp .env.example .env
chmod 600

# Generate BUNQ_ENCRYPTION_KEY
# NOTE: Add space before yarn to prevent the password from being
#       added to terminal history (does not work on Windows)
 yarn generate-encryption-key {password}

# Add configuration values to .env
edit .env
```

Finally, run the database migrations:

```bash
yarn knex migrate:latest
```

### Training classifier

Start by classifying payments manually (preferable more than 100):

```bash
yarn classify
```

This will add the payment information and given category (one of `PAYMENT_CATEGORIES` in `.env`) to the `payments` table.

Next, train the [LSTM network](https://github.com/BrainJS/brain.js#for-training-with-rnn-lstm-and-gru):

```bash
# Optionally pass number of epochs as first argument (default = 100)
yarn ai:train 100
```

This will train the classifier and store the updated network in the `classifiers` table.
The updated classifier will be used for future category predictions.
So when `yarn classify` is ran again, the predicted category will be selected by default.

Additionally, you can test the classifier by using:

```bash
yarn ai:predict "EUR, -5.50, Albert Heijn, UTRECHT, NL" # Correctly suggested "Voeding"
```

### Development

Instead of running `yarn classify`, you can use the following command to run `ts-node-dev`:

```bash
yarn dev
```

The script will be restarted on file changes.

Before committing code, run:

```bash
yarn lint
yarn test
```

## To Do

- [x] Improve classifier
      https://www.npmjs.com/package/clean-text-utils
      ASCII has 256 characters (per character: ascii code / 256, zero fill)
- [ ] Find lowest payment ID with no category (default `0`) and use as start ID for Bunq payments
- [ ] Add `--all` flag to ignore lowest payment ID and verify categories for all Bunq payments
- [ ] Train classifier after new input is given
- [ ] Keep database connection alive (pooling?), so training can be done for at least 300 epochs.
      Adding `keepAlive` or `idleTimeoutMillis` to database config didn't work.

## Quirks & Caveats

- The Bunq client paginates payments (max. 200 per page).
  Ideally we'd use async generator instead of fetching all payments at once.
- An out-of-the-box LSTM is used ([`brain.recurrent.LSTM`](https://github.com/BrainJS/brain.js/blob/master/src/recurrent/lstm.js)) for this prototype.
  This neural network does not scale, since each unique word is an input node of the network.
- The payment information is simply concatted: currency, amount, IBAN, and description as comma separated string.
- Storing the classifier JSON in a database record is not ideal, but used for convenience.
  Inspect this JSON to get a better feel for the inner workings of the classifer.
- Bug: `ts-node-dev` does not restart when a new file is created and imported into an existing file.
  It fails to load the new fail and says is doesn't exist.

## License

See `LICENSE` file.
