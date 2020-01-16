# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200115020227) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.string   "body"
    t.integer  "user_id"
    t.integer  "graffiti_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["graffiti_id"], name: "index_comments_on_graffiti_id", using: :btree
    t.index ["user_id"], name: "index_comments_on_user_id", using: :btree
  end

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   default: 0, null: false
    t.integer  "attempts",   default: 0, null: false
    t.text     "handler",                null: false
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.string   "queue"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree
  end

  create_table "graffitis", force: :cascade do |t|
    t.string   "borough"
    t.string   "status"
    t.string   "address"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "latitude"
    t.float    "longitude"
    t.jsonb    "images"
    t.integer  "user_id"
    t.datetime "incident_date"
    t.boolean  "hotspot",                 default: false
    t.datetime "streetview_capture_date"
    t.jsonb    "pov"
    t.index ["hotspot"], name: "index_graffitis_on_hotspot", using: :btree
    t.index ["user_id"], name: "index_graffitis_on_user_id", using: :btree
  end

  create_table "pictures", force: :cascade do |t|
    t.string   "address"
    t.string   "borough"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
  end

  create_table "upvotes", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "graffiti_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["graffiti_id"], name: "index_upvotes_on_graffiti_id", using: :btree
    t.index ["user_id", "graffiti_id"], name: "index_upvotes_on_user_id_and_graffiti_id", unique: true, using: :btree
    t.index ["user_id"], name: "index_upvotes_on_user_id", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "username"
    t.string   "provider"
    t.string   "uid"
    t.string   "oauth_token"
    t.datetime "oauth_expires_at"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
  end

  add_foreign_key "comments", "graffitis"
  add_foreign_key "comments", "users"
  add_foreign_key "upvotes", "graffitis"
  add_foreign_key "upvotes", "users"
end
