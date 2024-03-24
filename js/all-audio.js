function getAllAudioTags() {
    return [...document.querySelectorAll('audio')]
}

getAllAudioTags().forEach(function(item) {
    item.onplay = function onPlay(e) {
        var allAudioTags = getAllAudioTags()
        allAudioTags.forEach(function(item) {
            if (item === e.currentTarget) return
            setTimeout(() => item.pause(), 300)
        })
    }    
})