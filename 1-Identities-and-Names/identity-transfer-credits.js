// See https://docs.dash.org/projects/platform/en/stable/docs/tutorials/identities-and-names/transfer-credits-to-an-identity.html
const Dash = require('dash');
const dotenv = require('dotenv');
dotenv.config();

const clientOpts = {
  network: process.env.NETWORK,
  wallet: {
    mnemonic: process.env.MNEMONIC, // A Dash wallet mnemonic with testnet funds
    unsafeOptions: {
      skipSynchronizationBeforeHeight: process.env.SYNC_START_HEIGHT, // only sync from early-2022
    },
  },
};
const client = new Dash.Client(clientOpts);

const transferCredits = async () => {
  const identityId = process.env.IDENTITY_ID; // Your identity ID
  const identity = await client.platform.identities.get(identityId);

  const recipientID = process.env.RECIPIENT_ID; // Recipient's ID
  const recipientIdentity = await client.platform.identities.get(recipientID);
  console.log('Recipient identity balance before transfer: ', recipientIdentity.balance);
  const transferAmount = 1000; // Number of credits to transfer

  await client.platform.identities.creditTransfer(
    identity,
    recipientID,
    transferAmount,
  );
  return client.platform.identities.get(recipientID);
};

transferCredits()
  .then((d) => console.log('Recipient identity balance after transfer: ', d.balance))
  .catch((e) => console.error('Something went wrong:\n', e))
  .finally(() => client.disconnect());
