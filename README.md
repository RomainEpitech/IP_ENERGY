# IP_ENERGY

Application visant la gestion d'absences pour des entreprises.

## Back-End

L'api back end est codé en laravel est dispose de multiples routes avec 2 type d'accés:

### Routes User :
```php
  post /register // Inscription
```
```php
  post /login // Connexion
```
```php
  get /me // Information utilisateur connecté
```
```php
  post /logout // Déconnexion
```
```php
  delete /delete // Suppression de compte
```
```php
  put /update // Modification informations
```
```php
  get /absences // Liste des demandes d'absences
```
```php
  post /absences // Formulaire de demande d'absence
```

### Routes Admin:
```php
  get /admin/absences // Absences trié par utilisateurs
```
```php
  put /admin/absences/{id}/status // Modification status d'une demande
```
```php
  put /admin/users/{id} // Modification des infos de l'utilisateur
```
```php
  delete /admin/users/{id} // Suppression de l'utilisateur
```

Les routes sont protégées via un middleware pour le coté admin et via un token JWT pour le coté utilisateur.

## Front-End

Utils => Gestion des authentification et du stockage du token à la connexion.
Security => Protection d'accés aux pages vérifiant l'existence du token.
