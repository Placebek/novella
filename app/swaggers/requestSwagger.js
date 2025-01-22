/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Управление запросами пользователей
 */

/**
 * @swagger
 * /api/requests/create/requests:
 *   post:
 *     summary: Создать запрос с MP3 файлом
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               mp3:
 *                 type: string
 *                 format: binary
 *                 description: MP3 файл для обработки
 *     responses:
 *       201:
 *         description: Запрос успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     mp3:
 *                       type: string
 *                     title:
 *                       type: string
 *                     text:
 *                       type: string
 *       400:
 *         description: Ошибка валидации или отсутствие файла MP3
 *       401:
 *         description: Ошибка аутентификации, токен не предоставлен
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/requests/get:
 *   get:
 *     summary: Получить все запросы текущего пользователя
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список запросов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       mp3:
 *                         type: string
 *                       title:
 *                         type: string
 *                       text:
 *                         type: string
 *       401:
 *         description: Ошибка аутентификации, токен не предоставлен
 *       404:
 *         description: Нет запросов для текущего пользователя
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/requests/by-request/{:id}:
 *   get:
 *     summary: Получить все записи UserToGpt по ID запроса
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: request_id
 *         in: path
 *         required: true
 *         description: ID запроса
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешно возвращены данные UserToGpt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     text:
 *                       type: string
 *                 userToGpts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       variant:
 *                         type: string
 *                       parent_id:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Некорректный ID запроса
 *       401:
 *         description: Ошибка аутентификации, токен не предоставлен
 *       404:
 *         description: Запрос или записи UserToGpt не найдены
 *       500:
 *         description: Ошибка сервера
 */

/**
 * @swagger
 * /api/requests/unfinished:
 *   get:
 *     summary: Получить все незавершенные запросы текущего пользователя
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список незавершенных запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unfinishedRequests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       mp3:
 *                         type: string
 *                       text:
 *                         type: string
 *                       title:
 *                         type: string
 *                       is_activate:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Ошибка аутентификации, токен не предоставлен
 *       404:
 *         description: Нет незавершенных запросов для текущего пользователя
 *       500:
 *         description: Ошибка сервера
 */
