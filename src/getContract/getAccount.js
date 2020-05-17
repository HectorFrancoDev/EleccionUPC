import Web3 from 'web3';

const getAccount = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async function () {
            let web3 = window.web3;
            let account;

            if (typeof window.ethereum !== 'undefined') {
                ethereum.enable()
                    .then((accounts) => {
                        account = accounts[0];
                        resolve(account);
                        return;
                    })
                    .catch((error) => {
                        if (error.code === 4001) {
                            Swal.fire({
                                icon: 'errorx',
                                title: 'Se necesitan permisos',
                                text: 'Necesitas darle permiso a la aplicación para que interactue con Metamask'
                            });
                            reject();
                            return;
                        } else {
                            console.error(error);
                            reject();
                            return;
                        }
                    });

            } else if (typeof web3 !== 'undefined') {

                web3 = new Web3(web3.currentProvider);
                let cuenta = (await web3.eth.getAccounts())[0];
                resolve(cuenta);
                return

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Metamask no está instalado',
                    text: 'Necesitas Metamask o un navegador que utilice la API de Ethereum'
                });
                reject();
                return;
            }
        });
    });
}

export default getAccount;