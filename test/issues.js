// Dependencies
import Audio from '../src'
import assert,{deepEqual} from 'power-assert'

// Environment
process.env.MOCK_AUDIO_ELEMENT_TEST= true
const fixtureURL= 'http://static.edgy.black/fixture.mp3'

// Specs
describe('method',function(){
  this.timeout(10000)

  it('#1',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL
    audio.play()

    audio.addEventListener('timeupdate',()=>{
      audio= null
      done(new Error('detect leaks'))
    })
    audio.addEventListener('canplaythrough',()=>{
      if(audio===null){
        return
      }

      deepEqual(audio._eventHistory,[
        'pause',
        'canplaythrough',
      ])

      assert(audio.paused)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===0)

      done()
    })

    setTimeout(()=>{
      audio.pause()
    })
  })

  it('#2',(done)=>{
    let audio= new Audio
    audio.src= fixtureURL

    audio.addEventListener('canplaythrough',()=>{
      audio.play()
    })
    audio.addEventListener('play',()=>{
      deepEqual(audio._eventHistory,[
        'canplaythrough',
        'play',
      ])

      assert(audio.paused===false)
      assert(audio.duration===120.63985)
      assert(audio.currentTime===0)

      audio.pause()
      done()
    })
  })
})
