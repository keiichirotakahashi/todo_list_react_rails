source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.5'

# base
gem 'bootsnap', '>= 1.4.2', require: false
gem 'devise'
gem 'dotenv-rails'
gem 'jbuilder', '~> 2.7'
gem 'rails', '~> 6.0.3', '>= 6.0.3.1'

# database
gem 'pg', '>= 0.18', '< 2.0'

# server
gem 'puma', '~> 4.1'

# view
gem 'react-rails'
gem 'sass-rails', '>= 6'
gem 'slim'
gem 'turbolinks', '~> 5'
gem 'webpacker', '~> 4.0'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'factory_bot_rails'
  gem 'ffaker'
  gem 'rspec-rails'
  gem 'shoulda-matchers'
  gem 'spring-commands-rspec'
end

group :development do
  gem 'annotate'
  gem 'listen', '~> 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'database_cleaner'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
