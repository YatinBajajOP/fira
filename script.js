const HOST_URL = 'http://13.127.83.140'

task = `
        <div class='inputs'>
            <input type="text" class="title" name="title" placeholder='Title'>
            <input type="text" class="description" name="description" placeholder='Description'>
            <input type="date" class="date" name="date">
        </div>

        <div class='btns'>
            <img class="done" src='./assets/check_blue.png' ></img>
            <img class="edit" src='./assets/pen.png' ></img>
            <img class="btn" src='./assets/delete.png' ></img>
        </div>
`

function addTask(parent){
    const div = document.createElement('div')
    div.innerHTML = task
    div.classList.add('task')
    parent.appendChild(div)
    div.querySelector('.title').focus()
    changeEditBtn(div)
    div.querySelector('.done').addEventListener('click', () => onTaskComplete(div))
    div.querySelector('.edit').addEventListener('click', () => onTaskAdded(div))
    div.querySelector('.btn').addEventListener('click', () => deleteTask(div))
    return div
}

const renderTasks = () => {
    const not_completed = document.querySelector('#tasks')
    const completed = document.querySelector('#completed_tasks')
    not_completed.innerHTML = ''
    completed.innerHTML = ''
    const tasks = getTasks()
    for(let task of tasks){
        const div = addTask(task['status'] ? completed : not_completed)
        changeEditBtn(div)
        toggleInputs(div)
        div.querySelector('.edit').replaceWith(div.querySelector('.edit').cloneNode())
        div.querySelector('.edit').addEventListener('click', () => updateTask(div))
        div.querySelector('.inputs .title').value = task['title']
        div.querySelector('.inputs .description').value = task['description']
        div.querySelector('.inputs .date').value = task['date']
        div.querySelector('.btns .done').src = task.status ? './assets/check_green.png' : './assets/check_blue.png'
    }
    if(!document.querySelector('#tasks').innerHTML) document.querySelector('#remaining_heading').style.display = 'none'
    else document.querySelector('#remaining_heading').style.display = 'block'
    if(!document.querySelector('#completed_tasks').innerHTML) document.querySelector('#completed_heading').style.display = 'none'
    else document.querySelector('#completed_heading').style.display = 'block'
}

const getTasks = () => {
    let tasks = localStorage.getItem('tasks')
    if(!tasks){
        localStorage.setItem('tasks', JSON.stringify([]))
        return []
    }
    tasks = JSON.parse(tasks)
    return tasks
}

const onTaskAdded = (div) => {
    div.querySelector('.edit').replaceWith(div.querySelector('.edit').cloneNode())
    let tasks = JSON.parse(localStorage.getItem('tasks'))
    const data = {
        title: div.querySelector('.inputs .title').value,
        description: div.querySelector('.inputs .description').value,
        date: div.querySelector('.inputs .date').value,
        status: false,
    }
    
    tasks.push(data)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    toggleInputs(div)
    changeEditBtn(div)
    div.querySelector('.btns .edit').addEventListener('click', () => updateTask(div))
}

const changeEditBtn = (div) => {
    let src = div.querySelector('.btns .edit').src
    if(src === HOST_URL.concat('/assets/pen.png')) div.querySelector('.btns .edit').src = './assets/save.png'
    else div.querySelector('.btns .edit').src = './assets/pen.png'
}

const toggleInputs = (div) => {
    div.querySelectorAll('.inputs *').forEach(input => {
        input.disabled = !input.disabled
    });
}

const findDivIndex = (div) => {
    const tasks = document.querySelector('#tasks')
    const completed_tasks = document.querySelector('#completed_tasks')
    let i = 0;
    for(let task of tasks.childNodes){
        if(task === div){
            return {i, status:false}
        }
        i++
    }
    i = 0;
    for(let task of completed_tasks.childNodes){
        if(task === div){
            return {i, status:true}
        }
        i++
    }
}

const deleteTask = (div) => {
    
    const {i} = findDivIndex(div)
    let temp = JSON.parse(localStorage.getItem('tasks'))
    temp.splice(0, 1)
    localStorage.setItem('tasks', JSON.stringify(temp))
        
    div.parentNode.removeChild(div)
}

const updateTask = (div) => {
    changeEditBtn(div)
    toggleInputs(div)
    if(div.querySelector('.btns .edit').src === HOST_URL.concat('/assets/save.png')) return
    const data = {
        title: div.querySelector('.inputs .title').value,
        description: div.querySelector('.inputs .description').value,
        date: div.querySelector('.inputs .date').value,
        status: false,
    }

    const {i} = findDivIndex(div);
    let temp = JSON.parse(localStorage.getItem('tasks'))
    temp[i] = data
    localStorage.setItem('tasks', JSON.stringify(temp))
}

const onTaskComplete = (div) => {
    const src = div.querySelector('.btns .done').src
    if(src === HOST_URL.concat('/assets/check_blue.png')) div.querySelector('.btns .done').src = './assets/check_green.png'
    else div.querySelector('.btns .done').src = './assets/check_blue.png'
    const {i, status} = findDivIndex(div)
    console.log(i, status)
    let temp = JSON.parse(localStorage.getItem('tasks'))
    let k = 0
    let j = 0
    for(let task of temp){
        if(j === i && task.status===status){
            console.log('here')
            temp[k]['status'] = !temp[k]['status']
            break
        }
        if(status === task.status) j++
        k++
    }
    localStorage.setItem('tasks', JSON.stringify(temp))
    renderTasks()
}

document.querySelector('#add_task').addEventListener('click', () => addTask(document.querySelector('#tasks')))
renderTasks()
