import _ from "lodash";
import {
  NEMLibrary,
  NetworkTypes,
  TransactionHttp,
  Account,
  XEM,
  TransferTransaction,
  TimeWindow,
  Address,
  PlainMessage,
  EmptyMessage,
  AccountHttp,
  AssetHttp,
  AssetId,
  SimpleWallet,
  Password
} from "nem-library";
import * as firebase from "firebase";

const ADMIN_PRIVATE_KEY =
  '"a96c00a512be561230028ab99d04c5ee8848e586e7a1050425cf5c8056d55306';

const metodos = {
  crear: comando => {
    return new Promise((resolve, reject) => {
      const simplePassword = new Password(comando.password);
      const simpleWallet = SimpleWallet.create(comando.nombre, simplePassword);
      const account = simpleWallet.open(simplePassword);
      resolve({ account: account, wlt: simpleWallet.writeWLTFile() });
    });
  },
  enviarMensaje: comando => {
    return new Promise((resolve, reject) => {
      let { privateKey, address, mensaje } = comando;

      const transactionHttp = new TransactionHttp([
        { domain: "104.128.226.60" }
      ]);
      const account = Account.createWithPrivateKey(privateKey);
      const amount = new XEM(0);

      const transferTransaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        new Address(address),
        amount,
        PlainMessage.create(mensaje)
      );
      const signedTransaction = account.signTransaction(transferTransaction);

      transactionHttp
        .announceTransaction(signedTransaction)
        .toPromise()
        .then(data => {
          console.log(data);
          resolve(data);
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  },
  getByAddress: address => {
    return new Promise((resolve, reject) => {
      const accountHttp = new AccountHttp([{ domain: "104.128.226.60" }]);
      accountHttp.allTransactions(new Address(address)).subscribe(
        allTransactions => {
          resolve(allTransactions);
        },
        () => {
          reject("Error procesando la solicitud");
        }
      );
    });
  },
  transferir: comando => {
    return new Promise((resolve, reject) => {
      // let privateKey =
      //

      let { privateKey, address, cantidad } = comando;

      const transactionHttp = new TransactionHttp([
        { domain: "104.128.226.60" }
      ]);
      const account = Account.createWithPrivateKey(privateKey);
      const amount = new XEM(cantidad);

      const transferTransaction = TransferTransaction.create(
        TimeWindow.createWithDeadline(),
        new Address(address),
        amount,
        EmptyMessage
      );
      const signedTransaction = account.signTransaction(transferTransaction);

      transactionHttp
        .announceTransaction(signedTransaction)
        .toPromise()
        .then(data => {
          resolve(data);
        })
        .catch(({ message }) => {
          reject(message);
        });
    });
  }
};

export default metodos;
