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
    home: (req, res) => {
        db.query('select * from topic', (err, topics) => {
            var login = ``;
            var m = `<a href ='/create'>create</a>`;
            var b = `<h2> Welcome! </h2><p>Node.js Start Page</p>`;
            var t = `TOPIC 홈 화면`;

            login = authStatusUI(req, res);

            if (topics.length == 0) {
                {
                    m = `<h2> Welcome</h2><p>자료가 없으니 create 링크를 이용하여 자료를 입력하세요!</p>`;
                }
            }
            var context = {
                login: login,
                list: topics,
                menu: m,
                body: b,
                title: t
            };
            res.render('home05', context, (err, html) => {
                if (err) {
                    console.log(err);
                }
                res.end(html);
            });
        })
    },

    page: (req, res) => {
        var id = req.params.id;
        var sanitized_id = sani(id);

        var login = '';
        login = authStatusUI(req, res);

        db.query('select * from topic', (err, topics) => {
            if (err) {
                throw err;
            }


            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id =
            ${sanitized_id}`, (err2, topic) => {
                if (err2) {
                    throw err2;
                }

                var m = `<a href ='/create'>create</a>&nbsp;&nbsp;<a href ='/update/${sanitized_id}'>update</a>&nbsp;&nbsp;<a href ='/delete/${sanitized_id}' onclick
                ='if(confirm("정말로 삭제하시겠습니까 ?")==false){ return false}'>delete</a>`;
                var b = `<h2>${topic[0].title}</h2><p>${topic[0].descrpt}</p><p>by ${topic[0].name}</p>`;
                var t = `TOPIC 상세 페이지`
                var context = {
                    login: login,
                    list: topics,
                    menu: m,
                    body: b,
                    title: t
                };



                res.render('home05', context, (err, html) => {
                    if (err) {
                        console.log(err);
                    }
                    res.end(html);
                })
            });

        });
    },

    create: (req, res) => {
        var login = '';
        login = authStatusUI(req, res);

        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`)
            return; // 인증 실패 이후 추가적인 코드 실행을 막는다.
        }
        db.query(`select * from topic`, (err, topics) => {
            if (err) {
                throw err;
            }
            db.query(`SELECT * FROM author`, (err, authors) => {
                var i = 0;
                var tag = '';
                while (i < authors.length) {
                    tag += `<option value ="${authors[i].id}">${authors[i].name}</option>`
                    i++;
                }

                var m = `<a href ="create">create</a>`;
                var b = `<form action = '/create_process' method = 'post'>
                <p><input type = 'text' name = 'title' placeholder = 'title_create'></p>
                <p><textarea name = 'description' placeholder = 'description_create'></textarea></p>
                <p><select name = 'author'>
                ${tag}
                </select></p>
                <p><input type = 'submit'></p>
            </form>`;
                var t = `TOPIC 자료 생성 화면`

                var context = {
                    login: login,
                    list: topics,
                    menu: m,
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
    },

    create_process: (req, res) => {
        var post = req.body;
        sanitized_title = sani(post.title);
        sanitized_description = sani(post.description);
        sanitized_author = sani(post.author)

        db.query(`
            INSERT INTO topic (title, descrpt, created, author_id) values(?,?,NOW(), ?)`,
            [sanitized_title, sanitized_description, sanitized_author], (err, result) => {
                if (err) {
                    throw err;
                }
                res.writeHead(302, { Location: `/page/${result.insertId}` });
                res.end();
            })
    },

    update: (req, res) => {
        var id = req.params.pageId;
        var sanitize_id = sani(id);

        var login = '';
        login = authStatusUI(req, res);

        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`)
            return; // 인증 실패 이후 추가적인 코드 실행을 막는다.
        }

        db.query('select * from topic', (err, topics) => {
            if (err) {
                throw err;
            }


            db.query(`select * from topic where id = ${sanitize_id}`, (err2, topic) => {
                if (err2) {
                    throw err2;
                }
                db.query(`select * from author`, (err3, authors) => {
                    if (err3) {
                        throw err3
                    }

                    var i = 0;
                    var tag = '';
                    while (i < authors.length) {
                        var selected = '';
                        if (authors[i].id == topic[0].authors_id) {
                            selected = 'selected';
                        }
                        tag += `<option value ="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
                        i++;
                    }


                    var m = `<a href ='/create'>create</a>&nbsp;&nbsp;<a href ='/update/${topic[0].id}'>update</a>&nbsp;&nbsp;<a href ='/delete/${topic[0].id}' onclick
                ='if(confirm("정말로 삭제하시겠습니까 ?")==false){ return false}'>delete</a>`;
                    var b = `<form action = '/update_process' method = 'post'>
                    <input type = 'hidden' name = 'id' value = '${topic[0].id}'> 
                    <p><input type = 'text' name = 'title' placeholder = 'title_update' value = '${topic[0].title}'></p>
                    <p><textarea name = 'description' placeholder = 'description_update'>${topic[0].descrpt}</textarea></p>
                    <p><select name = 'author'>
                    ${tag}
                    </select>
                    </p>
                    <p><input type = 'submit'></p>
                </form>`;
                    var t = `TOPIC 자료 업데이트 화면`

                    var context = {
                        login: login,
                        list: topics,
                        menu: m,
                        body: b,
                        title: t
                    };

                    res.render('home05', context, (err, html) => {
                        if (err) {
                            console.log(err);
                        }
                        res.end(html);
                    })
                });

            });
        });
    },

    update_process: (req, res) => {
        var post = req.body;
        sanitized_title = sani(post.title);
        sanitized_description = sani(post.description);
        sanitized_author = sani(post.author);
        sanitized_id = sani(post.id);

        db.query(`update topic set title = ?, descrpt = ?, author_id =? where id = ?`,
            [sanitized_title, sanitized_description, sanitized_author, sanitized_id], (err, result) => {
                if (err) {
                    throw err;
                }
                res.writeHead(302, { Location: `/page/${post.id}` }); // redirect
                res.end();
            });
    },

    delete_process: (req, res) => {
        if (authIsOwner(req, res) == false) {
            res.end(`<script type="text/javascript">alert("Login required ~~~")
                        setTimeout("location.href = 'http://localhost:3000/'",1000);
          </script>`);
            return false; // 인증에 실패할 경우, 헤더 중복 작성을 방지하기 위해서 return.
        }
        id = req.params.pageId;
        db.query('DELETE FROM TOPIC WHERE id = ?', [id], (error, result) => {
            if (error) {
                throw (error);
            }
            res.writeHead(302, { location: `/` });
            res.end();
        });
    },

    login: (req, res) => {

        var login = '';
        login = authStatusUI(req, res);

        db.query('select * from topic', (err, topics) => {
            var m = `<a href ='/create'>create</a>`;
            var b = `<form action = '/login_process' method = 'post'>
            <p><input type = 'text' name = 'email' placeholder = 'email_login'></p>
            <p><input type = 'text' name = 'password' placeholder = 'password_login'></textarea></p>
            <p><input type = 'submit'></p>
        </form>`;
            var t = 'Login ID/PW 입력';
            if (topics.length == 0) {
                {
                    m = `<h2> Welcome</h2><p>자료가 없으니 create 링크를 이용하여 자료를 입력하세요!</p>`;
                }
            }
            var context = {
                login: login,
                list: topics,
                menu: m,
                body: b,
                title: t
            };
            res.render('home05', context, (err, html) => {
                if (err) {
                    console.log(err);
                }
                res.end(html);
            });
        })
    },

    login_process: (req, res) => {
        var post = req.body;
        if (post.email == 'bhwang99@gachon.ac.kr' && post.password == '123456') {
            req.session.is_logined = true;
            res.redirect('/');
        }

        else {
            res.end('Who?');
        }
    },

    logout_process: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });

    }
}  
