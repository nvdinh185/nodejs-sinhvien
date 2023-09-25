const studentsApi = "http://localhost:3000/students";

function generateUuid() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

async function displaySinhVien() {
    var students = await axios.get(studentsApi);
    students = students.data;

    var ulElement = $('#list-students');

    var htmls = students.map(function (student) {
        return `<li>
            <h2>Name: ${student.name}</h2>
            <p>Address: ${student.address}</p>
            <button onclick="onUpdate('${student.id}')">Sửa</button>
            <button onclick="onDelete('${student.id}')">Xóa</button>
        </li>`
    });

    ulElement.html(htmls.join(''));
}
displaySinhVien();

var createBtn = $('#create');
var updateBtn = $("#update");
var stName = $('input[name="name"]');
var address = $('input[name="address"]');

// Xử lý khi kích vào button Thêm
createBtn.click(async function () {
    var check = true;
    if (isRequired(stName)) {
        check = false;
    }
    if (isRequired(address)) {
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
            data: newSt
        })

        displaySinhVien();
        stName.val('');
        address.val('');
    }

    function isRequired(input) {
        var errorElement = input.parent().children()[3];
        if (input.val().trim() === '') {
            Object.assign(errorElement.style, {
                display: 'block',
                color: 'red',
                fontStyle: 'italic'
            })
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
            return true;
        }
    }
})

function handleBlurInput(input) {
    var errorElement = input.parent().children()[3];
    input.blur(function () {
        if (input.val().trim() === '') {
            $(errorElement).attr('style', 'display: block; color: red; font-style: italic;');
            $(errorElement).text('Yêu cầu nhập!');
            input.addClass('invalid');
        }
    })

    input.on('input', function () {
        $(errorElement).attr('style', 'display: none;');
        input.removeClass('invalid');
    })
}

handleBlurInput(stName);
handleBlurInput(address);

var idEd;
// Xử lý khi kích vào button Sửa
async function onUpdate(id) {
    idEd = id;
    // lấy sinh viên muốn sửa
    var student = await axios({
        method: "GET",
        url: studentsApi + "/" + id
    });
    student = student.data;

    stName.val(student.name);
    address.val(student.address);
    $(updateBtn).attr('style', 'display: block;');
    $(createBtn).attr('style', 'display: none');
}

updateBtn.click(async function () {
    var student = {
        id: idEd,
        name: stName.val(),
        address: address.val()
    }

    await axios({
        method: "PUT",
        url: studentsApi + "/" + idEd,
        data: student
    })

    displaySinhVien();
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
            url: studentsApi + '/' + id
        })

        displaySinhVien();
    }
}