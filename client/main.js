const studentsApi = "http://localhost:3000/students";

var createBtn = $('#create');
var updateBtn = $("#update");
var stName = $('input[name="name"]');
var address = $('input[name="address"]');

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Render ra từng sinh viên
 * @param {*} student 
 * @returns 
 */
function renderStudent(student) {
    return `<li class='student-${student.id}'>
                <h2>Name: ${student.name}</h2>
                <p>Address: ${student.address}</p>
                <button onclick="onUpdate('${student.id}')">Sửa</button>
                <button onclick="onDelete('${student.id}')">Xóa</button>
            </li>`
}

async function getData() {
    var students = await axios.get(studentsApi);
    students = students.data;

    var ulElement = $('#list-students');

    var htmls = '';
    for (const student of students) {
        htmls += renderStudent(student);
    }
    ulElement.html(htmls);
}

getData();

// Xử lý khi kích vào button Thêm
createBtn.click(async function () {
    var check = true;
    if (validation(stName)) {
        check = false;
    }
    if (validation(address)) {
        check = false;
    }
    if (check) {
        var newSt = {
            id: generateUuid(),
            name: stName.val(),
            address: address.val()
        }

        await axios({
            method: "POST",
            url: studentsApi,
            data: newSt,
            headers: { "Content-Type": "application/json" },
        })

        var ulElement = $('#list-students');
        ulElement.html(ulElement.html() + renderStudent(newSt));
        stName.val('');
        address.val('');
    }

    function validation(input) {
        var errorElement = input.parent().children()[3];
        if (input.val() === '') {
            Object.assign(errorElement.style, {
                display: 'block',
                color: 'red',
                fontStyle: 'italic'
            })
            $(errorElement).text('Yêu cầu nhập!');
            return true;
        } else {
            $(errorElement).attr('style', 'display: none;');
            return false;
        }
    }
})

function handleBlurInput(input) {
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val() === '') {
            $(errorElement).attr('style', 'display: block; color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
        } else {
            $(errorElement).attr('style', 'display: none;');
        }
    })
}

handleBlurInput(stName);
handleBlurInput(address);

var idEd;
// Xử lý khi kích vào button Sửa
async function onUpdate(id) {
    idEd = id;
    // tìm sinh viên muốn sửa
    var student = await axios.get(studentsApi + '/' + id);
    student = student.data;

    stName.val(student.name);
    address.val(student.address);
    $(updateBtn).attr('style', 'display: block;');
    $(createBtn).attr('style', 'display: none');
}

updateBtn.click(async function () {
    var edStudent = {
        id: idEd,
        name: stName.val(),
        address: address.val()
    }
    await axios({
        method: "PUT",
        url: studentsApi + "/" + idEd,
        data: edStudent,
        headers: { "Content-Type": "application/json" },
    })

    var htmls = renderStudent(edStudent);
    var studentElement = $('.student-' + idEd);
    if (studentElement) {
        studentElement.replaceWith(htmls);
    }
    stName.val('');
    address.val('');
    $(updateBtn).attr('style', 'display: none;');
    $(createBtn).attr('style', 'display: block;');
})

// Xử lý khi kích vào button Xóa
async function onDelete(id) {
    if (confirm("Bạn có chắc muốn xóa?")) {
        await axios({
            method: "DELETE",
            url: studentsApi + '/' + id,
            headers: { "Content-Type": "application/json" }
        })
        var studentElement = $('.student-' + id);
        if (studentElement) {
            studentElement.remove();
        }
    }
}