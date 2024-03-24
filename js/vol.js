function getAllAudioTags() {
    return [...document.querySelectorAll('audio')]
}

getAllAudioTags().forEach((item, index, arr) => {
    item.onvolumechange = (e) => arr.forEach((el) => {
        if(el === e.target) return
        el.volume = item.volume
    })
})