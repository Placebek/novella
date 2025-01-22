/**
 * @swagger
 * tags:
 *   name: UserToGpt
 *   description: Управление данными для взаимодействия с GPT
 */

/**
 * @swagger
 * /api/user_to_gpts/create/usertogpts:
 *   post:
 *     summary: Создать новый UserToGpt
 *     tags: [UserToGpt]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variant:
 *                 type: string
 *                 description: Вариант для GPT
 *               request_id:
 *                 type: integer
 *                 description: ID запроса, с которым связан вариант
 *     responses:
 *       201:
 *         description: UserToGpt успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userToGpt:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     variant:
 *                       type: string
 *                     parent_id:
 *                       type: integer
 *                     request_id:
 *                       type: integer
 *       400:
 *         description: Ошибка валидации данных или отсутствует обязательное поле
 *       401:
 *         description: Ошибка аутентификации, токен не предоставлен
 *       404:
 *         description: Запрос с указанным ID не найден
 *       500:
 *         description: Ошибка сервера
 */