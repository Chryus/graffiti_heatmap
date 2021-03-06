source 'https://rubygems.org'

ruby '2.6.2'

# Base

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.0.0'

#db
gem 'pg'

# angular
# compiles html templates into javascript and inserts them into Angular's $templateCache
gem "angularjs-rails"
gem 'angular-rails-templates'

# time
gem 'time_difference', '~> 0.4.2'

# auth
gem 'devise'

# performance
gem 'rack-mini-profiler'

# json for reading data
gem 'json', github: 'flori/json', branch: 'v1.8'

# query web services
gem 'httparty'

# env variables
gem 'figaro'

#upload
gem 'rmagick'
gem 'aws-sdk', '~> 2'
gem 'delayed_job_active_record'
gem 'delayed_job_web'
gem 'sinatra', github: 'sinatra'
gem "daemons"

#can't do without it
# gem 'debugger'

gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'pry-byebug'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  # fixtures replacement with a straightforward definition syntax
  gem "factory_girl_rails", "~> 4.0"
  # Testing framework for Rails 3.x, 4.x and 5.0.
  gem 'rspec-rails', '~> 3.5'
  # Javasript testing framework for Ruby-based web projects
  gem "jasmine", github: "pivotal/jasmine-gem"
end

# Access an IRB console on exception pages or by using <%= console %> in views
gem 'web-console', '~> 2.0', group: :development

group :production do
  #heroku asset gems to troubleshoot rails 4
  gem 'rails_12factor'
end

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.1.2'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]
