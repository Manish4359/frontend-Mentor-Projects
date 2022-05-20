const featureMenu = document.querySelector('.menu-feature');
const companyMenu = document.querySelector('.menu-company');
const navigation = document.querySelector('.navigation');
const sideBar = document.querySelector('.sidebar-btn');
featureMenu.addEventListener('click', (e) => {


    if (!featureMenu.classList.contains('active') && companyMenu.classList.contains('active') && window.innerWidth > 645) {
        subMenu(companyMenu)
    }
    subMenu(featureMenu);
})
companyMenu.addEventListener('click', (e) => {

    if (!companyMenu.classList.contains('active') && featureMenu.classList.contains('active') && window.innerWidth > 645) {
        subMenu(featureMenu)
    }
    subMenu(companyMenu);

})

function subMenu(menuElem) {
    const arrowImg = menuElem.children[1];
    const optionsBox = menuElem.children[2];

    if (!menuElem.classList.contains('active')) {

        arrowImg.style.transition = 'all 0.5s'
        arrowImg.style.transform = "rotateZ(180deg)";
        optionsBox.style.display = 'flex';

        if (optionsBox.classList.contains('company-box')) {
            optionsBox.style.height = '100px';
        } else {
            optionsBox.style.height = '150px';
        }

        optionsBox.style.animation = 'anim 0.5s forwards'
        menuElem.classList.add('active');
    }
    else {

        arrowImg.style.transform = "rotateZ(0deg)";
        optionsBox.style.display = ''
        menuElem.classList.remove('active');
    }
}
sideBar.addEventListener('click', (e) => {
    console.log(e.currentTarget.firstElementChild)

    if (!e.currentTarget.classList.contains('active')) {


        e.currentTarget.firstElementChild.setAttribute('src', './images/icon-close-menu.svg');
        navigation.style.display = 'flex';
        navigation.style.animation = 'sidebarAnim 0.5s forwards'
        e.currentTarget.classList.add('active')
        document.getElementById('modal').style.display='block';
    } else {

        e.currentTarget.firstElementChild.setAttribute('src', './images/icon-menu.svg');
        navigation.style.animation = ''

        navigation.style.display = '';
        document.getElementById('modal').style.display='';

        e.currentTarget.classList.remove('active')

    }

})

