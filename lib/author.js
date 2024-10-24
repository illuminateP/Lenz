const db = require('./db');
const qs = require('querystring');
const sani = require('sanitize-html');
const cookie = require('cookie');

function authIsOwner(req, res) {
    var isOwner = false;
    var cookies = {};

    if (req.session.is_logined) {
        return true;
    }
    else {
        return false;
    }

}

function authStatusUI(req, res) {
    var login = `<a href="/login">login</a>`;
    if (authIsOwner(req, res)) {
        login = `<a href="/logout_process">logout</a>`
    }
    return login;
}


module.exports = {
    create: (req, res) => {
        var login = '';
        login = authStatusUI(req, res);
        db.query('select * from topic', (err, topics) => {
            if (err) {
                console.log(err);
                throw err;
            }

            db.query('select * from author', (err2, authors) => {
                if (err2) {
                    console.log(err);
                    throw err2;
                }

                var i = 0;
                var tag = '<table border="1" style="border-collapse: collapse;">';
                for (i = 0; i < authors.length; i++) {
                    tag += `
                        <tr>
                            <td>${authors[i].name}</td>
                            <td>${authors[i].profile}</td>
                            <td><a href="/author/update/${authors[i].id}">update</a></td>
                            <td>
                                <a href="/author/delete/${authors[i].id}" 
                                   onclick="if(confirm('정말로 삭제하시겠습니까?')==false){return false;}">
                                   delete
                                </a>
                            </td>
                        </tr>
                    `;
                }
                tag += '</table>';

                if (authIsOwner(req, res)) {
                    var b = `
                    <form action='/author/create_process' method='post'>
                        <p><input type='text' name='name' placeholder='create_name'></p>
                        <p><input type='text' name='profile' placeholder='create_profile'></p>
                        <p><input type='submit' value='저자 생성'></p>
                    </form>
                `;
                } else {
                    b = '';
                };


                var t = `Author 자료 생성 화면`
                var context = {
                    login: login,
                    list: topics,
                    menu: tag,
                    body: b,
                    title: t
                };

                res.render('home05', context, (err, html) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    res.end(html);
                });
            });
        });
    },

    create_process: (req, res) => {
        var post = req.body;
        sanitized_Name = sani(post.name);
        sanitized_Profile = sani(post.profile);
        db.query(`
            INSERT INTO author (name,profile) values(?,?)`,
            [sanitized_Name, sanitized_Profile], (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.redirect('/author');
                res.end();
            })
    },

    update: (req, res) => {
        var login = '';
        login = authStatusUI(req, res);

        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`)
            return; // 인증 실패 이후 추가적인 코드 실행을 막는다.
        }
        var id = req.params.pageId;

        db.query('select * from topic', (err, topics) => {
            if (err) {
                console.log(err);
                throw err;
            }

            db.query('select * from author', (err2, authors) => {
                if (err2) {
                    console.log(err);
                    throw err2;
                }
                // 수정할 저자 정보 받아오기
                var sanitize_id = sani(id);
                db.query('select * FROM author WHERE id = ?', [sanitize_id], (err3, author) => {
                    if (err3) {
                        console.log(err);
                        throw err3;
                    }

                    var tag = '<table border="1" style="border-collapse: collapse;">';
                    for (i = 0; i < authors.length; i++) {
                        tag += `
                        <tr>
                            <td>${authors[i].name}</td>
                            <td>${authors[i].profile}</td>
                            <td><a href="/author/update/${authors[i].id}">update</a></td>
                            <td>
                                <a href="/author/delete/${authors[i].id}" 
                                   onclick="if(confirm('정말로 삭제하시겠습니까?')==false){return false;}">
                                   delete
                                </a>
                            </td>
                        </tr>
                    `;
                    }
                    tag += '</table>';

                    var b = `
                    <form action='/author/update_process' method='post'>                
                    <input type = 'hidden' name = 'id' value = '${id}'> 
                        <!-- authors 배열은 0부터 시작하지만, db의 id값은 1부터 시작한다. -->
                        <p><input type='text' name='name' placeholder='update_name' value = '${author[0].name}'></p>
                        <p><input type='text' name='profile' placeholder='update_profile' value = '${author[0].profile}'></p>
                        <p><input type='submit' value='수정'></p>
                    </form>
                `;

                    var t = `Author 자료 수정 화면`;
                    var context = {
                        login: login,
                        list: topics,
                        menu: tag,
                        body: b,
                        title: t
                    };
                    res.render('home05', context, (err, html) => {
                        if (err) {
                            console.log(err);
                        }
                        res.end(html);
                    });
                });
            });
        });
    },

    update_process: (req, res) => {
        var post = req.body;
        sanitized_Name = sani(post.name);
        sanitized_Profile = sani(post.profile);
        sanitize_id = sani(post.id);

        db.query(`update author set name = ?, profile = ? where id = ?`,
            [sanitized_Name, sanitized_Profile, sanitize_id], (err, result) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                res.writeHead(302, { Location: `/author` }); // redirect
                res.end();
            });
    },

    delete_process: (req, res) => {
        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`)
            return; // 인증 실패 이후 추가적인 코드 실행을 막는다.
        }
        id = req.params.pageId;
        sanitize_id = sani(id);
        db.query('DELETE FROM author WHERE id = ?', [sanitize_id], (error, result) => {
            if (error) {
                console.log(error);
                throw (error);
            }
            res.writeHead(302, { location: `/author` });
            res.end();
        });
    }


}