const getAccount = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async function () {

            let web3 = window.web3;
            if (typeof web3 !== undefined) {

                if (web3 == undefined) {
                    console.log('error');
                } else {

                    web3 = new Web3(web3.currentProvider);
                    let cuenta = (await web3.eth.getAccounts())[0];

                    web3.currentProvider.publicConfigStore.on('update', async function (event) {
                        cuenta = (await event.selectedAddress.toString());
                      });
                    console.log(cuenta);
                    resolve(cuenta);
                }
            } else {
                reject();
            }
        });
    });
}