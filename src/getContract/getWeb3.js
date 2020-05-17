import Web3 from 'web3';
import Swal from 'sweetalert2';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async function () {

            let web3 = window.web3;

            if (typeof window.ethereum !== 'undefined') {

                try {
                    const provider = window['ethereum'];
                    resolve(provider);
                    return;

                } catch (err) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Se necesitan permisos',
                        text: 'Necesitas darle permiso a la aplicación para que interactue con Metamask'
                    });
                    console.log(err);
                    return;
                }
            }

            if (typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider);
                resolve(web3);
                return;

            } else {
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
                reject();
                return;
            }
        });
    });
}

export default getWeb3;
