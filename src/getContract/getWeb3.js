import Web3 from 'web3';
import Swal from 'sweetalert2';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async function () {

            let web3 = window.web3;

            if (typeof window.ethereum !== 'undefined') {
                try {
                    await ethereum.enable();
                } catch (error) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Se necesitan permisos',
                        text: 'Necesitas darle permiso a la aplicación para que interactue con Metamask'
                    });
                }
            }

            if (typeof web3 !== undefined) {

                if (web3 == undefined) {
                    Swal.fire({
                        title: '<strong>INSTALAR METAMASK</strong>',
                        icon: 'error',
                        html:
                            'Hola, para poder acceder a la votación debes instalar Metamask' +
                            '<br>' +
                            '<img src="https://seeklogo.com/images/M/metamask-logo-3ED24848EE-seeklogo.com.png" width="40px" height="40px"></img>' +
                            '<br>' +
                            '<div>' +
                            '<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Extensión de Google Chrome</a>' +
                            '</div>' +
                            '<div>' +
                            '<a href="https://play.google.com/store/apps/details?id=io.metamask" target="_blank">Aplicación Android</a>' +
                            '</div>' +
                            '<div>' +
                            '<a href="https://testflight.apple.com/join/4cYoRF4M" target="_blank">Aplicación IOS</a>' +
                            '</div>' +
                            '<br>',
                        footer: '<p>Att: equipo de Elección UPC</p>'
                    });

                } else {

                    web3 = new Web3(web3.currentProvider);

                    let account = (await web3.eth.getAccounts())[0]
                    web3.currentProvider.publicConfigStore.on('update', async function (event) {
                        account = (await event.selectedAddress.toString());
                    });
                    console.log('CUENTA', account);
                    resolve(web3);
                }
            } else {
                console.log('No web3 provider found, please Install Metamask');
                reject();
            }
        });
    });
}

export default getWeb3;
