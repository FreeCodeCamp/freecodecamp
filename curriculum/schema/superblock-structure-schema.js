const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const slugRE = new RegExp('^[a-z0-9-]+$');

const schema = Joi.object()
  .keys({
    chapters: Joi.array().items(
      Joi.object().keys({
        dashedName: Joi.string().regex(slugRE).required(),
        id: Joi.objectId().when('chapterType', {
          not: ['exam', 'review'],
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        comingSoon: Joi.boolean().optional(),
        chapterType: Joi.valid('exam').optional(),
        modules: Joi.array()
          .items(
            Joi.object().keys({
              moduleType: Joi.valid('review', 'exam').optional(),
              comingSoon: Joi.boolean().optional(),
              dashedName: Joi.string().regex(slugRE).required(),
              id: Joi.objectId().when('moduleType', {
                not: ['exam', 'review'],
                then: Joi.required(),
                otherwise: Joi.optional()
              }),
              blocks: Joi.array().items(
                Joi.object().keys({
                  dashedName: Joi.string().regex(slugRE).required()
                })
              )
            })
          )
          .required()
      })
    )
  })
  // this makes sure there is no unknown key in the object
  .unknown(false);

exports.assertSuperBlockStructure = structure => Joi.assert(structure, schema);
