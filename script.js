window.onload = () => {
    const vh = window.window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)

    document.body.style.overflow = 'hidden'

    setTimeout(function () {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        document.body.style.transitionDuration = '1s'
        document.body.style.opacity = 1
    }, 1000)

    // document.querySelectorAll('.leaf').forEach((el) => {
    //     el.setAttribute('transform-origin', '50% 25%')
    // })

    gsap.registerPlugin(ScrollTrigger)

    gsap.set('.leaf', { transform: 'scale(0)' })
    // gsap.set('.leaf', { attr: { transform: 'scale(0)' } })

    const btn = document.querySelector('button')

    const btnBlink = gsap.to(btn.lastElementChild, { duration: 0.5, opacity: 0, repeat: -1, yoyo: true })

    const btnTl = gsap.timeline({
        paused: true,
        onComplete: () => {
            document.body.style.overflow = 'auto'
            document.body.style.overflowX = 'hidden'
            gsap.set('.first', { display: 'none' })
        },
    })

    btnTl.to(btn.firstElementChild, {
        duration: 1,
        scaleX: 2,
        scaleY: 2,
        backgroundImage: 'linear-gradient(45deg, #f00, #0f0, #00f)',
        ease: 'power2.in',
    })
    btnTl.to(btn.firstElementChild, {
        duration: 1,
        rotation: 180,
        scaleX: 5,
        scaleY: 8,
        opacity: 0,
        ease: 'power2.in',
    })
    btnTl.to('html', { duration: 1.2, '--clip-radius': '0%', ease: 'power1.out' }, 'first')
    btnTl.to(btn.lastElementChild, { duration: 1.2, opacity: 0, ease: 'power1.out' }, 'first')

    btn.addEventListener('click', () => {
        btnBlink.pause(0)
        btnTl.play(0)
    })

    gsap.set('.down', { scale: 0 })

    btnTl.then(() => {
        gsap.to('.down', { scale: 1, duration: 0.5 })
        gsap.to('.arrows svg', { opacity: 0, duration: 0.25, stagger: 0.25, yoyo: true, repeat: -1, ease: 'none' })
    })

    const flowerTl = gsap.timeline({
        defaults: {
            ease: 'none',
        },
        scrollTrigger: {
            markers: false,
            pin: true,
            scrub: 1,
            trigger: '.flower-container',
            start: 'top top',
            end: 4000,
        },
    })

    flowerTl.to('.clip-rect', { attr: { y: 50 } }, 'stem')
    flowerTl.to('.down', { y: -window.innerHeight / 2, opacity: 0 }, 'stem')

    flowerTl.to(
        '[data-leaf-white]',
        { transform: 'scale(1)', transformOrigin: '50% 25%', stagger: 0.1 },
        'leaf+=1'
    )
    flowerTl.to('[data-leaf-rgb]', { transform: 'scale(1)', transformOrigin: '50% 25%', stagger: 0.1 }, 'leaf')
    // flowerTl.to('[data-leaf-white]', { attr: { transform: 'scale(1)' }, stagger: 0.1 }, 'leaf+=1')
    // flowerTl.to('[data-leaf-rgb]', { attr: { transform: 'scale(1)' }, stagger: 0.1 }, 'leaf')

    flowerTl.to('.grad-stop-white', { attr: { offset: '0%' } }, 'leaf')
    flowerTl.to('.grad-stop-light1', { attr: { offset: '10%' } }, 'leaf')
    flowerTl.to('.grad-stop-light2', { attr: { offset: '50%' } }, 'leaf')
    flowerTl.to('.grad-stop-dark', { attr: { offset: '100%' } }, 'leaf')
    flowerTl.to('.flower-container', { y: -window.innerHeight / 2, opacity: 0 })

    const textTl = gsap.timeline({
        defaults: {
            ease: 'none',
        },
        scrollTrigger: {
            markers: false,
            pin: true,
            scrub: 1,
            trigger: '.last',
            start: 'top top',
            end: 8000,
        },
    })

    gsap.set('[data-c]', { scale: 0, x: 100 })
    gsap.set('[data-day]', { scale: 0, x: -window.innerWidth / 2 })
    gsap.set('[data-birth]', { scale: 0, x: window.innerWidth / 2, y: window.innerHeight / 2, rotation: -180 })

    textTl.to('[data-c]', { scale: 1, x: 0, stagger: 0.05 })
    textTl.to('[data-day]', { scale: 1, x: 0, stagger: 0.01, rotation: 360 })
    textTl.to('[data-birth]', { scale: 1, x: 0, y: 0, stagger: 0.01, rotation: 0 })
    textTl.to('.last', { '--last-radius': '0%' })

    const cnv = document.getElementById('canvas')
    const ctx = cnv.getContext('2d')

    cnv.width = window.innerWidth
    cnv.height = window.innerHeight

    const mouse = {
        x: null,
        y: null,
    }

    const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY
    })

    window.addEventListener('resize', () => {
        cnv.width = innerWidth
        cnv.height = window.innerHeight
        init()

        // gsap.set('[data-c]', { scale: 0, x: 100 })
        // gsap.set('[data-day]', { scale: 0, x: -innerWidth / 2 })
        // gsap.set('[data-birth]', { scale: 0, x: innerWidth / 2, y: window.innerHeight / 2, rotation: -180 })
        // gsap.set('.leaf', { attr: { transform: 'scale(0)' } })
        // gsap.set('.down', { scale: 0 })
    })

    const gravity = 0.1
    const friction = 0.99

    class Particle {
        constructor(x, y, radius, color, velocity) {
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
            this.alpha = 1
        }

        draw() {
            ctx.save()
            ctx.globalAlpha = this.alpha
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
            ctx.restore()
        }

        update() {
            this.draw()
            this.velocity.x *= friction
            this.velocity.y *= friction
            this.velocity.y += gravity
            this.x += this.velocity.x
            this.y += this.velocity.y
            this.alpha -= 0.05
        }
    }

    let particles

    function init() {
        particles = []
    }

    function animation() {
        const interval = 1000 / 60
        let timer = 0
        let lastFrame = 0
        function animate(frame) {
            const deltaTime = frame - lastFrame
            lastFrame = frame
            if (timer > interval) {
                // ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
                // ctx.fillRect(0, 0, cnv.width, cnv.height)
                ctx.clearRect(0, 0, cnv.width, cnv.height)
                for (let i = 0; i < particles.length; i++) {
                    if (particles[i].alpha > 0) {
                        particles[i].update()
                    } else {
                        particles.splice(i, 1)
                    }
                }
                timer = 0
            } else {
                timer += deltaTime
            }
            requestAnimationFrame(animate)
        }
        animate(0)
    }

    init()
    animation()

    let isCanvas = false

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const intersecting = entry.isIntersecting
                isCanvas = intersecting ? true : false
            })
        },
        { threshold: 0.9 }
    )

    observer.observe(cnv)

    window.addEventListener('pointerdown', (e) => {
        mouse.x = e.clientX
        mouse.y = e.clientY

        const particleCount = 25
        const angleIncrement = (Math.PI * 2) / particleCount
        const power = 10

        if (isCanvas && particles.length < particleCount * 4) {
            for (let i = 0; i < particleCount; i++) {
                particles.push(
                    new Particle(mouse.x, mouse.y, 3, `hsl(${Math.random() * 360}, 60%, 50%)`, {
                        x: Math.cos(angleIncrement * i) * Math.random() * power,
                        y: Math.sin(angleIncrement * i) * Math.random() * power,
                    })
                )
            }
        }
    })
}
