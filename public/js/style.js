// const source = document.querySelector(".goLogin").innerHTML;
// const template = Handlebars.compile(source);
// document.body.innerHTML = template()

// navbar action
const navBar = () => {
    let x = document.querySelector(".navLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
};

// document.querySelector(".goLogin").addEventListener("click",e=>{
//     location.href = "/login"
// })
