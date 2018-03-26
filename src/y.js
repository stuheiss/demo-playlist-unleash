let state = {}
array = []
array.push({ name: 'a', value: 'aa' })
array.push({ name: 'b', value: 'bb' })
array.push({ name: 'c', value: 'cc' })

array

array.map(x => {
  if (x.name === 'a') x.value = 'abc'
})

array

state.array = array

state

array[0].value = 'abcde'

state

let array2 = []
let x = array2[0]
x
