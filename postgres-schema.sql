-- ============================================
-- SCRIPT COMPLET CRÉATION BDD ADUL21
-- PostgreSQL natif
-- ============================================

-- Activer les UUID (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- FONCTION : Trigger pour updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TABLE : pre_members (Pré-adhésions - Phase 1)
-- ============================================

CREATE TABLE pre_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Informations personnelles
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  city VARCHAR(100) NOT NULL CHECK (city IN ('Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre')),

  -- Profil
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'parent', 'worker', 'senior', 'pmr', 'other')),

  -- Intentions d'engagement
  wants_to_become_member BOOLEAN DEFAULT TRUE,
  wants_to_volunteer BOOLEAN DEFAULT FALSE,
  can_host_meeting BOOLEAN DEFAULT FALSE,
  can_distribute_flyers BOOLEAN DEFAULT FALSE,
  participation_areas TEXT[], -- ['communication', 'legal', 'events', 'actions', 'press', 'admin']

  -- Consentements
  accepts_newsletter BOOLEAN DEFAULT FALSE,
  accepts_contact_when_created BOOLEAN DEFAULT TRUE,
  accepts_ag_invitation BOOLEAN DEFAULT TRUE,

  -- Statut
  converted_to_member BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  member_id UUID -- Foreign key will be added later after members table is created
);

-- Index
CREATE INDEX idx_pre_members_email ON pre_members(email);
CREATE INDEX idx_pre_members_city ON pre_members(city);
CREATE INDEX idx_pre_members_converted ON pre_members(converted_to_member);
CREATE INDEX idx_pre_members_created ON pre_members(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_pre_members_updated_at BEFORE UPDATE ON pre_members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE : members (Adhérents - Phase 2)
-- ============================================

CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Informations personnelles
  civility VARCHAR(10) NOT NULL CHECK (civility IN ('M.', 'Mme', 'Autre')),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE,

  -- Contact
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  city VARCHAR(100) NOT NULL CHECK (city IN ('Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre')),

  -- Profil d'usager
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'parent', 'senior', 'pmr', 'worker', 'other')),
  school_name VARCHAR(200),
  school_section VARCHAR(200),
  usage_before VARCHAR(50) CHECK (usage_before IN ('daily', '2-3_per_week', 'weekly', 'occasional')),
  usage_after VARCHAR(50) CHECK (usage_after IN ('car', 'correspondences', 'depends_on_someone', 'stopped')),

  -- Adhésion (Phase 2: 4 niveaux)
  membership_fee DECIMAL(10, 2) NOT NULL CHECK (membership_fee >= 0),
  membership_level VARCHAR(20) NOT NULL CHECK (membership_level IN ('solidaire', 'soutien', 'actif', 'parrain')),
  membership_type VARCHAR(20) CHECK (membership_type IN ('reduced', 'normal', 'support', 'custom')), -- Backward compatibility
  membership_status VARCHAR(20) DEFAULT 'pending' CHECK (membership_status IN ('pending', 'active', 'expired', 'cancelled')),
  membership_start_date DATE,
  membership_end_date DATE,
  payment_method VARCHAR(50) CHECK (payment_method IN ('check', 'transfer', 'cash')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'confirmed', 'failed')),

  -- Justificatif pour adhésion solidaire (0€)
  solidarity_proof_type VARCHAR(50) CHECK (solidarity_proof_type IN ('student_card', 'unemployment', 'rsa', 'aah', 'other')),
  solidarity_proof_url TEXT,

  -- Engagement (pour niveau "actif")
  wants_to_participate BOOLEAN DEFAULT FALSE,
  participation_areas TEXT[], -- ['communication', 'legal', 'events', 'actions', 'press', 'admin']
  monthly_hours_commitment INT, -- Pour niveau "actif": minimum 2h/mois

  -- Consentements RGPD
  accepts_newsletter BOOLEAN DEFAULT FALSE,
  accepts_testimony_publication BOOLEAN DEFAULT FALSE,
  accepts_media_contact BOOLEAN DEFAULT FALSE,
  accepts_action_solicitation BOOLEAN DEFAULT FALSE,

  -- Admin
  is_admin BOOLEAN DEFAULT FALSE,
  password_hash VARCHAR(255), -- Si admin
  notes TEXT,

  -- Lien avec pré-adhésion
  from_pre_member_id UUID REFERENCES pre_members(id)
);

-- Index pour performances
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_city ON members(city);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_members_created ON members(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE : testimonies (Témoignages)
-- ============================================

CREATE TABLE testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Auteur
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100), -- Optionnel pour anonymat
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  city VARCHAR(100) NOT NULL CHECK (city IN ('Ledenon', 'Cabrières', 'Saint-Gervasy', 'Autre')),
  age_range VARCHAR(20) NOT NULL CHECK (age_range IN ('13-17', '18-25', '26-35', '36-50', '51-65', '66+')),

  -- Profil
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'parent', 'senior', 'pmr', 'worker', 'other')),
  school_name VARCHAR(200),
  school_section VARCHAR(200),
  workplace VARCHAR(200),
  work_hours VARCHAR(100),

  -- Usage ligne 21 - AVANT
  usage_before_frequency VARCHAR(50) CHECK (usage_before_frequency IN ('daily', '2-3_per_week', 'weekly', 'occasional')),
  usage_before_time INT, -- en minutes
  usage_before_destination VARCHAR(200),
  usage_before_cost DECIMAL(10, 2),

  -- Usage ligne 21 - APRÈS
  usage_after_solution VARCHAR(50) CHECK (usage_after_solution IN ('car', 'correspondences', 'depends_on_someone', 'stopped')),
  usage_after_distance DECIMAL(10, 2), -- km
  usage_after_cost DECIMAL(10, 2),
  usage_after_num_correspondences INT,
  usage_after_wait_time INT,
  usage_after_missed_per_month INT,

  -- Problèmes rencontrés (boolean flags)
  has_missed_correspondences BOOLEAN DEFAULT FALSE,
  has_delays BOOLEAN DEFAULT FALSE,
  has_physical_difficulty BOOLEAN DEFAULT FALSE,
  has_fear BOOLEAN DEFAULT FALSE,
  has_extra_cost BOOLEAN DEFAULT FALSE,

  -- Témoignage
  testimony_text TEXT NOT NULL CHECK (LENGTH(testimony_text) >= 200 AND LENGTH(testimony_text) <= 2000),
  concrete_example TEXT CHECK (concrete_example IS NULL OR LENGTH(concrete_example) <= 500),

  -- Publication
  publication_preference VARCHAR(50) NOT NULL CHECK (publication_preference IN ('first_name', 'initials', 'anonymous')),
  accepts_site_publication BOOLEAN DEFAULT TRUE,
  accepts_legal_use BOOLEAN DEFAULT FALSE,
  accepts_association_contact BOOLEAN DEFAULT FALSE,
  accepts_media_contact BOOLEAN DEFAULT FALSE,
  accepts_oral_testimony BOOLEAN DEFAULT FALSE,

  -- Photo
  photo_url TEXT,

  -- Modération
  moderation_status VARCHAR(20) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'needs_modification')),
  moderation_notes TEXT,
  moderated_by UUID REFERENCES members(id),
  moderated_at TIMESTAMPTZ,

  -- Statistiques (après publication)
  views_count INT DEFAULT 0,
  reactions_count INT DEFAULT 0,
  shares_count INT DEFAULT 0,

  -- Flags
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE -- Mis en avant sur homepage
);

-- Index
CREATE INDEX idx_testimonies_status ON testimonies(moderation_status);
CREATE INDEX idx_testimonies_published ON testimonies(is_published);
CREATE INDEX idx_testimonies_featured ON testimonies(is_featured);
CREATE INDEX idx_testimonies_city ON testimonies(city);
CREATE INDEX idx_testimonies_created ON testimonies(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_testimonies_updated_at BEFORE UPDATE ON testimonies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE : donations (Dons ponctuels)
-- ============================================

CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Donateur
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Don
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'EUR',
  payment_method VARCHAR(50) CHECK (payment_method IN ('check', 'transfer', 'cash')),

  -- Statut
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmed_at TIMESTAMPTZ,

  -- Reçu fiscal
  receipt_sent BOOLEAN DEFAULT FALSE,
  receipt_sent_at TIMESTAMPTZ,

  -- Consentements
  accepts_newsletter BOOLEAN DEFAULT FALSE,

  -- Notes
  message TEXT,
  admin_notes TEXT
);

-- Index
CREATE INDEX idx_donations_email ON donations(email);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created ON donations(created_at DESC);

-- ============================================
-- TABLE REMOVED: subscriptions (Dons mensuels)
-- NOTE: Table supprimée - sera réactivée avec Stripe dans le futur
-- ============================================

-- ============================================
-- TABLE : downloads (Tracking téléchargements)
-- ============================================

CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Fichier
  file_name VARCHAR(200) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- 'courrier_maire', 'courrier_metropole', 'guide', etc.

  -- Utilisateur (tracking anonyme)
  ip_address INET,
  user_agent TEXT,

  -- Géoloc (optionnel)
  country_code VARCHAR(2),
  city VARCHAR(100)
);

-- Index
CREATE INDEX idx_downloads_file ON downloads(file_name);
CREATE INDEX idx_downloads_type ON downloads(file_type);
CREATE INDEX idx_downloads_created ON downloads(created_at DESC);

-- ============================================
-- TABLE : news (Actualités)
-- ============================================

CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Contenu
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,

  -- Auteur
  author_id UUID REFERENCES members(id),

  -- Publication
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,

  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),

  -- Stats
  views_count INT DEFAULT 0
);

-- Index
CREATE INDEX idx_news_published ON news(is_published, published_at DESC);
CREATE INDEX idx_news_slug ON news(slug);

-- Trigger updated_at
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE : incidents (Signalements d'incidents)
-- ============================================

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Date de l'incident
  incident_date DATE NOT NULL,
  incident_time TIME,

  -- Type
  incident_type VARCHAR(50) NOT NULL CHECK (incident_type IN ('missed_correspondence', 'delay', 'no_bus', 'accessibility', 'extra_cost', 'other')),
  bus_line VARCHAR(50),
  description TEXT NOT NULL,

  -- Conséquence
  consequence VARCHAR(50) CHECK (consequence IN ('late_work', 'missed_appointment', 'taxi_cost', 'abandoned_trip', 'other')),
  consequence_details TEXT,
  taxi_cost DECIMAL(10, 2),

  -- Auteur (optionnel)
  email VARCHAR(255)
);

-- Index
CREATE INDEX idx_incidents_date ON incidents(incident_date DESC);
CREATE INDEX idx_incidents_type ON incidents(incident_type);

-- ============================================
-- FOREIGN KEYS (ajoutées après création des tables)
-- ============================================

-- Ajouter la foreign key pour pre_members.member_id maintenant que members existe
ALTER TABLE pre_members
ADD CONSTRAINT fk_pre_members_member_id
FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL;

-- ============================================
-- VUES UTILES (pour stats rapides)
-- ============================================

-- Vue : Stats membres par ville
CREATE VIEW members_by_city AS
SELECT
  city,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE membership_status = 'active') as active,
  SUM(membership_fee) FILTER (WHERE membership_status = 'active') as total_fees
FROM members
GROUP BY city;

-- Vue : Stats témoignages
CREATE VIEW testimonies_stats AS
SELECT
  moderation_status,
  COUNT(*) as count
FROM testimonies
GROUP BY moderation_status;

-- Vue : Stats dons
CREATE VIEW donations_stats AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM donations
WHERE status = 'confirmed'
GROUP BY month
ORDER BY month DESC;

-- ============================================
-- POLICIES ROW LEVEL SECURITY (Supabase)
-- ============================================

-- Vue : Stats pré-membres (Phase 1)
CREATE VIEW pre_members_stats AS
SELECT
  COUNT(*) as total_supports,
  COUNT(*) FILTER (WHERE wants_to_become_member = TRUE) as wants_membership,
  COUNT(*) FILTER (WHERE wants_to_volunteer = TRUE) as wants_to_volunteer,
  COUNT(*) FILTER (WHERE converted_to_member = TRUE) as converted
FROM pre_members;

-- Activer RLS sur toutes les tables
ALTER TABLE pre_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Policies pour pre_members (écriture libre, lecture admin uniquement)
CREATE POLICY "Anyone can register as pre-member"
ON pre_members FOR INSERT
WITH CHECK (TRUE);

-- Policies pour testimonies (lecture publique des publiés, écriture libre)
CREATE POLICY "Public can view published testimonies"
ON testimonies FOR SELECT
USING (is_published = TRUE);

CREATE POLICY "Anyone can submit testimony"
ON testimonies FOR INSERT
WITH CHECK (TRUE);

-- Policies pour news (lecture publique des publiés)
CREATE POLICY "Public can view published news"
ON news FOR SELECT
USING (is_published = TRUE);

-- Policies pour downloads (écriture libre pour tracking)
CREATE POLICY "Anyone can track downloads"
ON downloads FOR INSERT
WITH CHECK (TRUE);

-- Pour le reste, accès uniquement via service role (API backend)
