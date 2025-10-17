-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,

  -- Personal info
  civility varchar(10) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  birth_date varchar(10),

  -- Contact
  email varchar(255) NOT NULL UNIQUE,
  phone varchar(20),
  address text NOT NULL,
  postal_code varchar(10) NOT NULL,
  city varchar(100) NOT NULL,

  -- Profile
  user_type varchar(50) NOT NULL,
  school_name varchar(255),
  school_section varchar(255),
  usage_before varchar(50),
  usage_after varchar(50),

  -- Membership
  membership_fee decimal(10, 2) NOT NULL,
  membership_type varchar(50) NOT NULL,
  membership_status varchar(50) NOT NULL DEFAULT 'pending',
  membership_start_date timestamp,
  membership_end_date timestamp,
  payment_method varchar(50),
  stripe_customer_id varchar(255),

  -- Engagement
  wants_to_participate boolean NOT NULL DEFAULT false,
  participation_areas json,

  -- Consents
  accepts_newsletter boolean NOT NULL DEFAULT false,
  accepts_testimony_publication boolean NOT NULL DEFAULT false,
  accepts_media_contact boolean NOT NULL DEFAULT false,
  accepts_action_solicitation boolean NOT NULL DEFAULT false,

  -- Admin
  is_admin boolean NOT NULL DEFAULT false,
  notes text
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,

  name varchar(100) NOT NULL,
  email varchar(255) NOT NULL,
  phone varchar(20),
  subject varchar(255) NOT NULL,
  message text NOT NULL,
  accepts_contact boolean NOT NULL DEFAULT false,

  status varchar(50) NOT NULL DEFAULT 'new',
  replied_at timestamp,
  replied_by varchar(255),
  reply_notes text
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,

  email varchar(255) NOT NULL UNIQUE,
  first_name varchar(100),
  last_name varchar(100),

  is_active boolean NOT NULL DEFAULT true,
  unsubscribed_at timestamp,

  source varchar(50) NOT NULL
);

-- Create news table (for admin stats)
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,

  title varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  cover_image_url text,

  author_id uuid,

  is_published boolean NOT NULL DEFAULT false,
  published_at timestamp,

  meta_title varchar(255),
  meta_description text,

  views_count integer NOT NULL DEFAULT 0
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(membership_status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
