class Particles {
	constructor(
		amountParticles = 3,
		min_size = 13,
		max_size = 25,
		interval = 7
	) {
		this.min = min_size - 1
		this.range = max_size - min_size + 1
		
		this.animations = ['left100', 'left30', 'right30', 'right100']
		this.animation = `${interval}s ease-out`
		this.timer = interval * 1000 + 500
		this.sleepCreateParticle = interval * 214

		this.leftParticles = document.getElementsByClassName('left_particles')[0]
		this.rightParticles = document.getElementsByClassName('right_particles')[0]
		this.downParticles = document.getElementsByClassName('down_particles')[0]
		this.particles = []
		this.intervals = []
		this.createParticles(amountParticles)

		this.rightParticlesChildren = this.rightParticles.children
		this.document = document.documentElement
		this.lastDocumentWidth = this.document.clientWidth
		window.addEventListener('resize', this.hideOverflowParticles)

		document.onvisibilitychange = this.disableParticles
	}



	createParticles(amountParticles) {
		for (let i = 0; i < amountParticles; i++) {
			this.createParticle(this.leftParticles)
			this.createParticle(this.rightParticles)
			this.createParticle(this.downParticles)
		}

		this.setAnimationAllParticles()
	}



	sleep(time) {
		return new Promise(res => {
			setTimeout(res, time)
		})
	}



	createParticle(particleContainer) {
		const particle = document.createElement('div')
		particle.className = 'particle'
		particle.style.animation = this.animation
		particleContainer.appendChild(particle)

		const animation = particleContainer.className == 'right_particles'
			? this.changeAnimationRight
			: this.changeAnimation

		this.particles.push({particle, animation})
	}



	setAnimationAllParticles = async () => {
		let i = 0
		for (let particle of this.particles) {
			if (document.hidden) break
			this.setAnimation(particle.particle, particle.animation)
			i++
			if (i % 3 == 0)
				await this.sleep(this.sleepCreateParticle)
		}
	}

	setAnimation = (particle, animation) => {
		animation(particle)
		const interval = setInterval(async () => {
			particle.style.animationName = ''
			await this.sleep(100)
			animation(particle)
		}, this.timer)

		this.intervals.push(interval)
	}



	changeAnimation = particle => {
		const size = this.min + Math.ceil(Math.random() * this.range)
		particle.style.width = particle.style.height = size + 'em'

		particle.style.top = 30 + Math.ceil(Math.random() * 65) + '%'

		const left = 10 + Math.ceil(Math.random() * 80)
		particle.style.left = `calc(${left}% - ${Math.ceil(size/2)}px)`

		const i_animation = this.rightParticles.clientWidth > 80
			? Math.ceil(Math.random() * 4) - 1
			: 2
		particle.style.animationName = this.animations[i_animation]
	}



	changeAnimationRight = particle => {
		const size = this.min + Math.ceil(Math.random() * this.range)
		particle.style.width = particle.style.height = size + 'em'

		particle.style.top = 30 + Math.ceil(Math.random() * 65) + '%'

		const width = this.rightParticles.clientWidth
		let left = 10 + Math.ceil(Math.random() * 80)
		left = width * (left/100) - size
		particle.style.left = left + 'px'

		let i_animation
		if (left < width - 120)
			i_animation = Math.ceil(Math.random() * 4) - 1
		else if (left < width - 50)
			i_animation = Math.ceil(Math.random() * 3) - 1
		else i_animation = 1

		particle.style.animationName = this.animations[i_animation]
	}



	hideOverflowParticles = () => {
		if (this.documentBigger()) return

		const width = this.rightParticles.clientWidth - 30
		let left, animation, animationName

		for (let particle of this.rightParticlesChildren) {
			animationName = particle.style.animationName
			animation = parseInt(/\d+/.exec(animationName))
			animation *= animationName.substr(0, 1) == 'r' ? 1 : -1

			left = parseInt(particle.style.left)
			if (left > width)
				particle.style.left = width - 30 + 'px'

			left = parseInt(particle.style.left)
			if (left + animation > width)
				particle.style.animationName = 'left30'
		}
	}

	documentBigger = () => {
		const increase = this.document.clientWidth >= this.lastDocumentWidth
			? true
			: false
		this.lastDocumentWidth = this.document.clientWidth
		return increase
	}



	disableParticles = () => {
		let particle
		const len = this.particles.length

		if (document.hidden) {
			for (let i = 0; i < len; i++) {
				clearInterval(this.intervals[i])
				particle = this.particles[i].particle
				particle.style.animationName = ''
			}
			this.intervals = []
		} else
			this.setAnimationAllParticles()
	}
}

new Particles
