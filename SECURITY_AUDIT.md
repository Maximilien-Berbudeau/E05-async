# Audit de Sécurité - Projet E05-async

## ✅ Conformité au cahier des charges

### Services implémentés (Phase 1 complétée)
- [x] Frontend (React + Vite)
- [x] Backoffice (React + Vite)
- [x] API Users (Node.js + Express + PostgreSQL)
- [x] API Data (Node.js + Express + PostgreSQL)
- [x] Service Security (Node.js + Express + PostgreSQL + JWT)
- [x] Logger (Node.js + Express + MongoDB + Redis)

### Services manquants (à implémenter en Phase 2-3)
- [ ] Reverse-proxy (nginx)
- [ ] 3x PostgreSQL databases
- [ ] 1x MongoDB database
- [ ] 2x Redis (cache + broker)
- [ ] Adminer
- [ ] MongoDB Express

## 🔒 Analyse de sécurité

### ✅ BONNES PRATIQUES IMPLÉMENTÉES

1. **Gestion des mots de passe**
   - ✅ Utilisation de bcrypt pour le hashing
   - ✅ Stockage des hash uniquement (pas de mots de passe en clair)
   - ✅ Comparaison sécurisée avec bcrypt.compare()

2. **Authentification JWT**
   - ✅ Utilisation de jsonwebtoken
   - ✅ Expiration des tokens (24h)
   - ✅ Vérification des tokens côté serveur

3. **CORS**
   - ✅ Middleware CORS activé sur toutes les APIs
   - ⚠️  À configurer avec whitelist en production

4. **Variables d'environnement**
   - ✅ Utilisation de dotenv
   - ✅ Variables pour DB, secrets, etc.

5. **Base de données**
   - ✅ Requêtes paramétrées (protection SQL injection)
   - ✅ Pool de connexions PostgreSQL
   - ✅ Gestion des erreurs de connexion

### ⚠️ PROBLÈMES DE SÉCURITÉ À CORRIGER

#### CRITIQUE
1. **JWT_SECRET par défaut**
   ```javascript
   const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
   ```
   - ❌ Secret par défaut exposé dans le code
   - 🔧 **Solution**: Forcer une variable d'environnement, pas de fallback

2. **Hash de mot de passe invalide dans init.sql**
   ```sql
   -- Password: admin123
   INSERT INTO auth_users (email, password_hash, role) VALUES
     ('admin@example.com', '$2b$10$rZ3qZ8Y...', 'admin')
   ```
   - ❌ Hash factice/invalide (trop court)
   - 🔧 **Solution**: Générer un vrai hash bcrypt

3. **Pas de rate limiting**
   - ❌ Endpoints d'auth vulnérables au brute-force
   - 🔧 **Solution**: Ajouter express-rate-limit

#### IMPORTANT
4. **Pas de validation des inputs**
   - ❌ Pas de sanitization des données
   - 🔧 **Solution**: Ajouter express-validator ou joi

5. **Erreurs détaillées en production**
   ```javascript
   res.status(err.status || 500).json({
     error: err.message || 'Internal Server Error'
   });
   ```
   - ❌ Stack traces potentiellement exposées
   - 🔧 **Solution**: Masquer les détails en prod

6. **CORS trop permissif**
   ```javascript
   app.use(cors());
   ```
   - ❌ Accepte toutes les origines
   - 🔧 **Solution**: Whitelist d'origines

7. **Pas de HTTPS**
   - ❌ Trafic non chiffré
   - 🔧 **Solution**: Configurer TLS dans nginx (Phase 2)

#### MOYEN
8. **Pas de logs de sécurité**
   - ⚠️  Pas de traçabilité des tentatives de connexion
   - 🔧 **Solution**: Logger les échecs d'auth

9. **Pas de timeouts**
   - ⚠️  Requêtes DB sans timeout
   - 🔧 **Solution**: Configurer statement_timeout

10. **Headers de sécurité manquants**
    - ⚠️  Pas de helmet.js
    - 🔧 **Solution**: Ajouter helmet pour headers HTTP

## 📋 Recommandations par priorité

### PRIORITÉ 1 (Avant Phase 2)
- [ ] Corriger JWT_SECRET (forcer env var)
- [ ] Générer vrai hash bcrypt pour init.sql
- [ ] Ajouter express-rate-limit sur /auth/login
- [ ] Configurer CORS avec whitelist

### PRIORITÉ 2 (Phase 2)
- [ ] Ajouter express-validator sur tous les endpoints
- [ ] Implémenter helmet.js
- [ ] Masquer stack traces en production
- [ ] Ajouter logs de sécurité

### PRIORITÉ 3 (Phase 3)
- [ ] Configurer HTTPS dans nginx
- [ ] Ajouter timeouts DB
- [ ] Implémenter audit trail complet
- [ ] Ajouter monitoring de sécurité

## 🔐 Corrections immédiates à appliquer

### 1. Corriger JWT_SECRET
```javascript
// security/routes/auth.js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
```

### 2. Générer vrai hash bcrypt
```bash
# Générer hash pour "admin123"
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(console.log)"
```

### 3. Ajouter rate limiting
```javascript
const rateLimit = require('express-rate-limit');
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 tentatives max
});
app.use('/api/auth/login', authLimiter);
```

### 4. Configurer CORS
```javascript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
};
app.use(cors(corsOptions));
```

## 📊 Score de sécurité actuel

- **Authentification**: 6/10
- **Autorisation**: 7/10
- **Protection données**: 7/10
- **Input validation**: 3/10
- **Error handling**: 4/10
- **Logging**: 5/10
- **Network security**: 5/10

**Score global**: 5.3/10 ⚠️

Avec les corrections P1: ~7/10 ✅
Avec P1+P2: ~8.5/10 🎯

