SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA inbox;
ALTER SCHEMA inbox OWNER TO whisper;

CREATE SCHEMA "user";
ALTER SCHEMA "user" OWNER TO whisper;

SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE inbox.conversations (
    id uuid NOT NULL,
    is_group boolean DEFAULT false,
    title text,
    CONSTRAINT title_only_for_groups CHECK ((((is_group = true) AND (title IS NOT NULL)) OR ((is_group = false) AND (title IS NULL))))
);
ALTER TABLE inbox.conversations OWNER TO whisper;

CREATE TABLE inbox.messages (
    id uuid NOT NULL,
    chat_id uuid,
    sender_id uuid,
    ciphertext bytea NOT NULL,
    deleted boolean DEFAULT false
);
ALTER TABLE inbox.messages OWNER TO whisper;

CREATE TABLE inbox.participants (
    chat_id uuid NOT NULL,
    user_id uuid NOT NULL
);
ALTER TABLE inbox.participants OWNER TO whisper;

CREATE TABLE "user".auth (
    id uuid NOT NULL,
    username character varying(40) NOT NULL,
    registration_record character varying(256) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified boolean DEFAULT false NOT NULL
);
ALTER TABLE "user".auth OWNER TO whisper;

CREATE TABLE "user".login_state (
    user_id uuid,
    login_state character varying(256),
    id uuid NOT NULL
);
ALTER TABLE "user".login_state OWNER TO whisper;

CREATE TABLE "user".profile (
    id uuid NOT NULL,
    bio text,
    image uuid
);
ALTER TABLE "user".profile OWNER TO whisper;

CREATE TABLE "user".session (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    session_key text NOT NULL,
    revoked boolean DEFAULT false
);
ALTER TABLE "user".session OWNER TO whisper;

ALTER TABLE ONLY inbox.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);

ALTER TABLE ONLY inbox.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY inbox.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (chat_id, user_id);

ALTER TABLE ONLY "user".auth
    ADD CONSTRAINT auth_email UNIQUE (email);
ALTER TABLE ONLY "user".auth
    ADD CONSTRAINT auth_id PRIMARY KEY (id);
ALTER TABLE ONLY "user".auth
    ADD CONSTRAINT auth_username UNIQUE (username);

ALTER TABLE ONLY "user".login_state
    ADD CONSTRAINT login_state_pk PRIMARY KEY (id);

ALTER TABLE ONLY "user".profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (id);

ALTER TABLE ONLY "user".session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);
ALTER TABLE ONLY "user".session
    ADD CONSTRAINT session_session_id_key UNIQUE (session_key);

CREATE INDEX auth_id_idx ON "user".auth USING btree (id, username, email, registration_record);

ALTER TABLE ONLY inbox.messages
    ADD CONSTRAINT messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES inbox.conversations(id) ON DELETE CASCADE;
ALTER TABLE ONLY inbox.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES "user".auth(id);

ALTER TABLE ONLY inbox.participants
    ADD CONSTRAINT participants_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES inbox.conversations(id) ON DELETE CASCADE;
ALTER TABLE ONLY inbox.participants
    ADD CONSTRAINT participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user".auth(id) ON DELETE CASCADE;

ALTER TABLE ONLY "user".profile
    ADD CONSTRAINT profile_id_fkey FOREIGN KEY (id) REFERENCES "user".auth(id) ON DELETE CASCADE;

ALTER TABLE ONLY "user".session
    ADD CONSTRAINT session_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user".auth(id) ON DELETE CASCADE;
