import DBService from './db.service.js'

const loggedinUser = {
  email: 'dore.zahavy@sqmail.com',
  fullName: 'Dore Babaji',
}

async function query(criteria = {}) {
  const txt = criteria.txt || ''
  const folder = criteria.folder || ''

  const values = [`%${txt}%`, `%${txt}%`, `%${txt}%`, `%${txt}%`]

  let filterClause = ''

  switch (folder) {
    case 'inbox':
      filterClause = `AND is_draft = 0 AND is_trash = 0 AND to_user = '${loggedinUser.email}'`
      break
    case 'sent':
      filterClause = `AND is_draft = 0 AND is_trash = 0 AND from_user = '${loggedinUser.email}'`
      break
    case 'trash':
      filterClause = 'AND is_trash = 1'
      break
    case 'draft':
      filterClause = 'AND is_draft = 1'
      break
    case 'starred':
      filterClause = `AND is_draft = 0 AND is_trash = 0 AND is_starred = 1`
      break
    default:
      break
  }

  const query = `SELECT 
                mail.id AS id,
                mail.subject AS subject,
                mail.is_draft AS isDraft,
                mail.body AS body,
                mail.sent_at AS sentAt,
                mail.from_user AS "from",
                mail.to_user AS "to",
                mail.is_read AS isRead,
                mail.is_starred AS isStarred,
                mail.is_trash AS isTrash
                FROM mail  
                 WHERE 
                (mail.subject LIKE ? OR
                 mail.from_user LIKE ? OR
                 mail.to_user LIKE ? OR
                 mail.body LIKE ?)
                 ${filterClause}
                 ORDER BY sent_at DESC`

  return DBService.runSQL(query, values)
}

async function getById(mailId) {

  const query = `SELECT 
    mail.id AS id,
    mail.subject AS subject,
    mail.is_draft AS isDraft,
    mail.body AS body,
    mail.sent_at AS sentAt,
    mail.from_user AS "from",
    mail.to_user AS "to",
    mail.is_read AS isRead,
    mail.is_starred AS isStarred,
    mail.is_trash AS isTrash
    FROM mail
    WHERE mail.id = ?;`

  const values = [mailId]
  const mails = await DBService.runSQL(query, values)
  if (mails.length === 1) return mails[0]
  throw new Error(`mail id ${mailId} not found`)
}

async function add(values) {
  const sqlCmd = `INSERT INTO mail (subject, body, sent_at, from_user, to_user, is_read, is_starred, is_trash, is_draft) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

  return await DBService.runSQL(sqlCmd, values)
}

async function update(values) {
  const query = `UPDATE mail set subject = ?,
                        body = ?,
                        sent_at = ?,
                        from_user = ?,
                        to_user = ?,
                        is_read = ?,
                        is_starred = ?,
                        is_trash = ?,
                        is_draft = ?
                        WHERE mail.id = ?`

  const okPacket = await DBService.runSQL(query, values)
  if (okPacket.affectedRows !== 0) return okPacket
  throw new Error(`No bug updated - bug id ${bug._id}`)
}

function remove(mailId) {
  var query = `DELETE FROM mail WHERE mail.id = ?`
  const values = [mailId]
  return DBService.runSQL(query, values).then((okPacket) =>
    okPacket.affectedRows === 1
      ? okPacket
      : Promise.reject(new Error(`No mail deleted - mail id ${mailId}`))
  )
}

function getLoggedinUser() {
  return loggedinUser
}

export const mailService = {
  query,
  getById,
  add,
  update,
  remove,
  getLoggedinUser,
}
