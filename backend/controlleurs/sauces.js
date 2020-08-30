//Importation du modele Sauce
const modelSauce = require('../models/sauces');
// FS
const fs = require('fs');

/// ajoute sauce
exports.createSauce = (req, res, next) => {
  delete req.body._id;
  const objetSauce = JSON.parse(req.body.sauce);

  const sauce = new modelSauce({
    ...objetSauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Réussi,objet enregistré !' }))
    .catch(() => {
      res.status(400).json({ error });
    });
};

//Met à jour la sauce avec l'identifiant fourni
exports.updateSauce = (req, res, next) => {
  const objetSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  modelSauce
    .updateOne({ _id: req.params.id }, { ...objetSauce, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié ! ' }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprime la sauce avec l'ID fourni
exports.deleteSauce = (req, res, next) => {
  modelSauce
    .findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        modelSauce
          .deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé ! ' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

///Renvoie le tableau de toutes les sauces
exports.getSauces = (req, res, next) => {
  modelSauce
    .find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Renvoie la sauce avec l'ID fourni
exports.getSauce = (req, res, next) => {
  modelSauce
    .findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/// Contrôler  les likes et dislikes des sauces
// par défaut likes = 0; dislikes = 0;
exports.like = (req, res, next) => {
  const like = req.body.like;

  /// Vérifier si l'utilisateur à déja liker la sauce
  if (like == 0) {
    modelSauce
      .findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.find((user) => user === req.body.userId)) {
          modelSauce
            .updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id,
              }
            )
            .then(() => {
              res
                .status(201)
                .json({ message: 'Nous avons bien reçu votre avis' });
            })
            .catch((err) => res.status(400).json({ err }));

          // Vérifier si l'utilisateur n'a pas déja disliker la sauce
        }
        if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
          modelSauce
            .updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id,
              }
            )
            .then(() => {
              res
                .status(201)
                .json({ message: 'Nous avons bien reçu votre avis' });
            })
            .catch((err) => res.status(400).json({ err }));
        }
      })
      .catch((error) => {
        res.status(404).json({ error: error });
      });
  }

  //Ajouter un like

  if (like == 1) {
    modelSauce
      .updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
          _id: req.params.id,
        }
      )
      .then(() => {
        res.status(201).json({ message: 'Nous avons bien reçu votre like' });
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
  }

  //ajouter un dislike

  if (like == -1) {
    modelSauce
      .updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id,
        }
      )
      .then(() => {
        res.status(201).json({ message: 'Nous avons bien reçu votre dislike' });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
};
