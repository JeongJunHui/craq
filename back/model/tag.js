var mysql_dbc = require('../db/db_con.js')();
var connection = mysql_dbc.init();
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const TRUE = 1;

const initializeEndpoints = (app) => {
  /**
   * @swagger
   *  /tags:
   *    post:
   *      tags:
   *      - tag
   *      description: 하나의 태그를 작성
   *      parameters:
   *      - name: tagInfo
   *        in: body
   *        schema:
   *          type: object
   *          properties:
   *            title:
   *              type: string
   *              description: 태그명
   *            body:
   *              type: string
   *              description: 태그의 내용 및 설명
   *            user_id:
   *              type: integer
   *              description: 작성자의 user id값
   *            user_token:
   *              type: string
   *              description: 사용자의 token 정보
   *      responses:
   *        200:
   */
  app.post('/tags', function(req, res) {
    var i = req.body;
    jwt.verify(i.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "INSERT INTO tag(title,body,createdUser,updatedUser) VALUES(?,?,?,?)";
        var params = [i.title, i.body, i.user_id, i.user_id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags:
   *    get:
   *      tags:
   *      - tag
   *      description: 모든 태그를 받아옴.
   *      parameters:
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM tag";
        connection.query(sql, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags/{id}:
   *    get:
   *      tags:
   *      - tag
   *      description: 특정 태그의 정보를 받아옴(1)
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 태그의 id 값을 전달
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.get('/tags/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "SELECT * FROM tag WHERE pk = ?";
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags/{id}:
   *    put:
   *      tags:
   *      - tag
   *      description: 특정 태그의 정보와 수정시간, 수정자를 갱신함
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 태그의 id 값을 전달
   *      - name: user_id
   *        in: query
   *        type: integer
   *        description: 수정한 user의 id 값을 전달
   *      - name: body
   *        in: query
   *        type: string
   *        description: 수정할 내용
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.put('/tags/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "UPDATE tag SET body = ?, updatedUser = ? WHERE pk = ?";
        var params = [req.query.body, req.query.user_id, req.params.id];
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

  /**
   * @swagger
   *  /tags/{id}:
   *    delete:
   *      tags:
   *      - tag
   *      description: 특정 태그를 삭제.
   *      parameters:
   *      - name: id
   *        in: path
   *        type: integer
   *        description: 특정 태그의 id 값을 전달
   *      - name: user_token
   *        in: query
   *        type: string
   *        description: 사용자의 token값을 전달
   *      responses:
   *        200:
   */
  app.delete('/tags/:id', function(req, res) {
    jwt.verify(req.query.user_token, secretObj.secret, function(err, decoded) {
      if (err) res.status(401).send({
        error: 'invalid token'
      });
      else {
        var sql = "DELETE FROM tag WHERE pk = ?";
        var params = req.params.id;
        connection.query(sql, params, function(err, rows, fields) {
          if (!err) {
            res.json(rows);
          } else {
            console.log('Error while performing Query.', err);
            res.send(err);
          }
        });
      }
    });
  });

};
module.exports = initializeEndpoints;