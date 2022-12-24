import joi from 'joi';
export const articleValidation = async (req, res, next) => {
  const articleSchema = joi
    .object({
      title: joi.string().required(),
      author: joi.string().required(),
      content: joi.string().required(),
    })
    .options({ allowUnknown: true });
  const value = await articleSchema.validate(req.body);
  if (value.error) {
    res.status(400).json({
      message: value.error.details[0].message.replace(/["'`]+/g, ''),
    });
  } else {
    next();
  }
};
