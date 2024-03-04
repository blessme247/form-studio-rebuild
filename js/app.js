import { lerp } from "./utils.js";
import { createProjects, createBlogposts } from "./projects.js";

createProjects()
createBlogposts()

const main = document.querySelector('main')
const video = document.querySelector(".main__video");
const videoSection = document.querySelector("#video");
const headerLeft = document.querySelector('.text__header__left')
const headerRight = document.querySelector('.text__header__right')

// Video
main.addEventListener('scroll', ()=> animateVideo())

const animateVideo = ()=>{

    // get bottom of the sticky div because when we get to the bottom of the section, we want our video to scale to 1
    let { bottom} = videoSection.getBoundingClientRect()

    let scale = 1 - ((bottom - window.innerHeight) * .0005)


    scale = scale < .2 ? .2 : scale > 1 ? 1 : scale
    video.style.transform = `scale(${scale})` 

    // Text Transformation
    let textTrans = bottom - window.innerHeight
    textTrans = textTrans < 0 ? 0 : textTrans 
    headerLeft.style.transform = `translateX(${-textTrans}px)`
    headerRight.style.transform = `translateX(${textTrans}px)`

}

// Projects
let projectTargetX = 0;
let projectCurrentX = 0;

const projectSticky = document.querySelector('.projects__sticky')
const projectSlider = document.querySelector('.projects__slider')

// the percentages object aids responsiveness on different device types,
// for small devices, the max vw will be 700vw, and so on.
let percentages = {
    small: 700,
    medium: 300,
    large: 100
}

let limit = window.innerWidth <= 600 ? percentages.small :
            window.innerWidth <= 1100 ? percentages.medium :
            percentages.large

const setLimit = ()=> {
     limit = window.innerWidth <= 600 ? percentages.small : 
                window.innerWidth <= 1100 ? percentages.medium :
                 percentages.large
}

window.addEventListener('resize', setLimit)

const animateProjects = ()=> {
    let offsetTop = projectSticky.parentElement.offsetTop
    let percentage = ((main.scrollTop - offsetTop) / window.innerHeight) * 100
    percentage = percentage < 0 ? 0 : percentage > limit ? limit : percentage // prevents the projects from animating until we get to its section
    projectTargetX = percentage
    projectCurrentX = lerp(projectCurrentX, projectTargetX, .1)
    projectSlider.style.transform = `translate3d(${-(projectCurrentX)}vw, 0, 0 )`

}

// Blog Posts Animation
const blogSection = document.getElementById('blog')
const blogPosts = [...document.querySelectorAll('.post')]

const scrollBlogPosts = ()=> {
    let blogSectionTop = blogSection.getBoundingClientRect().top
    for(let i = 0; i < blogPosts.length; i++){
        if(blogPosts[i].parentElement.getBoundingClientRect().top <= 1){
            // +1 to account for the first BLOG title div
            let offset = (blogSectionTop + (window.innerHeight * (i + 1))) * .0005
            offset = offset < -1 ? -1 : offset >= 0 ? 0 : offset
            blogPosts[i].style.transform = `scale(${1 + offset})` // scale down each blog post div
        }
    }
}

// Circle animation
const circleSection = document.getElementById('circle__section');
const circle = document.querySelector('.circle');

const scrollCircle =()=>{
    let {top} = circleSection.getBoundingClientRect();
    let scaleTop = Math.abs(top);
    let scale = (scaleTop / window.innerHeight)
    scale = scale < 0 ? 0 : scale > 1 ? 1 : scale;
    if(top <= 0){
        // Start the animation when the circleSection is at the top of the viewport
        circle.style.transform = `translate(-50%, -50%) scale(${scale})`;
    }else{
        circle.style.transform = `translate(-50%, -50%) scale(${0})`;
    }
}

// Discover text animation
const dContainer = document.querySelector('.discover__container')
const leftText = document.querySelector('.text__left');
const rightText = document.querySelector('.text__right');

const scrollDiscover =()=>{
    let {bottom} = dContainer.getBoundingClientRect();
    let textTrans = bottom - window.innerHeight;
    textTrans = textTrans < 0 ? 0 : textTrans
    leftText.style.transform = `translateX(${-textTrans}px)`
    rightText.style.transform = `translateX(${textTrans}px)`
}

// Text Reveal Animation
const textReveals = [...document.querySelectorAll('.text__reveal')]

let callback = (entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            [...entry.target.querySelectorAll('span')].forEach((span, i) => {
                setTimeout(()=> {
                    span.style.transform = `translateY(0)`
                })
            })
        }
    })
})

let options = {
    rootMarging: '0px',
    threshold: 1.0
}

let observer = new IntersectionObserver(callback, options)

textReveals.forEach(text => {
    let string = text.innerHTML
    console.log(string)
    let html = ''
    for (let i = 0; i < string.length; i++){
        html += `<span> ${string[i]} </span>`
    }
    console.log(html)
    text.innerHTML = html
    observer.observe(text.parentElement)
})

main.addEventListener('scroll', () => {
    scrollBlogPosts();
    scrollCircle();
    scrollDiscover()
})

const animate = ()=>{
    animateProjects()
    requestAnimationFrame(animate)
}
animate()
    