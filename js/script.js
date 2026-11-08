//================================================================================================
// FORM
//================================================================================================

window.addEventListener('pageshow', function (event){
   const form = document.querySelector('.cc-right');
    if (form){
        form.reset();
    }
});


//================================================================================================
// ACTIVE NAV (MAIN BAR)
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".main-nav a");
    
    const viewpointOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
    };
    
    const viewpoint = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting){
                const id = entry.target.getAttribute("id");
                
                navLinks.forEach((link) => link.classList.remove("active"));
                
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if (activeLink){
                    activeLink.classList.add("active");
                }
            }
        });
    }, viewpointOptions);
    
    sections.forEach((section) => viewpoint.observe(section));
});


//================================================================================================
// VIEW PROJECT TAG 
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const cursorTag = document.getElementById("project-cursor-tag");
    const projectLinks = document.querySelectorAll(".project-link");
    
    let typingInterval = null;
    window.addEventListener("mousemove", (e) => {
        if (cursorTag) {
            cursorTag.style.left = `${e.clientX}px`;
            cursorTag.style.top = `${e.clientY}px`;
        }
    });
    
    function typeText(targetText) {
        clearInterval(typingInterval);
        let currentText = "VIEW ";
        if (!cursorTag) return;
        cursorTag.textContent = currentText;
        let index = 0;
        typingInterval = setInterval(() =>{
            if (index < targetText.length){
                currentText += targetText[index]; 
                cursorTag.textContent = currentText;
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 25);
    }
                                 
    projectLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
            const projectName = link.getAttribute("data-name") || "";
            if (cursorTag) cursorTag.classList.add("visible");
            typeText(projectName);
        });
        
        link.addEventListener("mouseleave",() => {
            clearInterval(typingInterval);
            if (cursorTag) {
                cursorTag.classList.remove("visible");
                cursorTag.textContent = "";
            }
        });
    });
});


//================================================================================================
// PROJECTS PROGRESS BAR
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return; 
    gsap.registerPlugin(ScrollTrigger);
    
    const projects = document.querySelector("#projects");
    const projectViews = gsap.utils.toArray(".project-view");
    const navLinks = document.querySelectorAll(".projects-nav a");
    const projectsNavContainer = document.querySelector(".projects-nav");
    
    if (!projects || !projectViews.length || !projectsNavContainer) return;
    
    //baseline layout properties
    gsap.set(projectsNavContainer, { opacity: 0, pointerEvents: "none" });
    
    function updateActiveNav(activeId) {
        navLinks.forEach(link => {
            const isTarget = link.getAttribute("href") === `#${activeId}`;
            link.classList.toggle("active", isTarget);
        });
    }
    
    // highlights active nav
    projectViews.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onEnter: () => updateActiveNav(section.id),
            onEnterBack: () => updateActiveNav(section.id)
        });
    });
    
    //sticky 
    ScrollTrigger.create({
        trigger: projects,
        start: "top bottom-=10%", 
        end: "bottom bottom",
        onEnter: () => gsap.to(projectsNavContainer, { opacity: 1, pointerEvents: "all", duration: 0.3 }),
        onLeave: () => gsap.to(projectsNavContainer, { opacity: 0, pointerEvents: "none", duration: 0.2 }),
        onEnterBack: () => gsap.to(projectsNavContainer, { opacity: 1, pointerEvents: "all", duration: 0.3 }),
        onLeaveBack: () => gsap.to(projectsNavContainer, { opacity: 0, pointerEvents: "none", duration: 0.2 })
    });
});


//================================================================================================
// ACTIVE LINKS (when in projects)
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("claustra.html")) {
        const globalMainLinks = document.querySelectorAll(".main-nav a");
        globalMainLinks.forEach(link => {
            if (link.getAttribute("href").includes("#projects")) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
});


//================================================================================================
// CAROUSEL 
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const carousels = document.querySelectorAll(".carousel-wrapper");

    carousels.forEach((carousel) => {
        const track = carousel.querySelector(".carousel-track");
        const prevBtn = carousel.querySelector(".prev-btn");
        const nextBtn = carousel.querySelector(".next-btn");

        if (!track || !prevBtn || !nextBtn) return;

        nextBtn.addEventListener("click", () => {
            const slideWidth = track.getBoundingClientRect().width;
            
            // Loop back to start if reaching the end
            if (track.scrollLeft + slideWidth >= track.scrollWidth - 10) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                track.scrollBy({ left: slideWidth, behavior: "smooth" });
            }
        });

        prevBtn.addEventListener("click", () => {
            const slideWidth = track.getBoundingClientRect().width;
            
            // Loop to the end if clicking back at the start
            if (track.scrollLeft <= 10) {
                track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
            } else {
                track.scrollBy({ left: -slideWidth, behavior: "smooth" });
            }
        });
    });
});


//================================================================================================
// POPUP MODAL
//================================================================================================

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("graphic-popup");
    const popupImg = document.getElementById("popup-target-img");
    const popupVideo = document.getElementById("popup-target-video");
    const closeBtn = popup ? popup.querySelector(".graphic-popup-close") : null;

    if (!popup || !popupImg || !popupVideo) return;

    const triggers = document.querySelectorAll(".graphic-popup-trigger");

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            
            const imgAsset = trigger.querySelector("img");
            const videoAsset = trigger.querySelector("video source") || trigger.querySelector("video");

            popupImg.style.display = "none";
            popupVideo.style.display = "none";
            popupImg.src = "";
            popupVideo.src = "";
            popupVideo.removeAttribute("controls"); 

            if (imgAsset) {
                popupImg.src = imgAsset.src;
                popupImg.style.display = "block";
                openPopup();
            } else if (videoAsset) {
                popupVideo.src = videoAsset.src || videoAsset.getAttribute("src");
                popupVideo.style.display = "block";
                
                // Audio Control 
                popupVideo.setAttribute("controls", "true"); 
                popupVideo.muted = false; 
                popupVideo.volume = 0.7; // baseline volume level

                popupVideo.load();
                popupVideo.play();
                openPopup();
            }
        });
    });

    function openPopup() {
        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closePopup() {
        popup.classList.remove("active");
        document.body.style.overflow = "";
        popupVideo.pause();
        setTimeout(() => {
            popupImg.src = "";
            popupVideo.src = "";
            popupVideo.removeAttribute("controls"); // remove controls when closed
        }, 300);
    }

    if (closeBtn) closeBtn.addEventListener("click", closePopup);

    popup.addEventListener("click", (e) => {
        if (e.target === popup || e.target.classList.contains("graphic-popup-content")) {
            closePopup();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
        }
    });
});


//================================================================================================
// BACK TO HOME 
//================================================================================================

let mybutton = document.getElementById("goBackBtn");

// Browser window scrolling distance
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (!mybutton) return;
  
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    //fade-in transitions
    mybutton.classList.add("visible"); 
  } else {
    //remove
    mybutton.classList.remove("visible");
  }
}

