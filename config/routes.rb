Rails.application.routes.draw do
  resources :users, only: :show
  devise_for :users, :controllers => {sessions: 'sessions'}
  
  root to: 'application#angular'

  resources :graffiti, only: [:create, :index, :show] do
    collection do
      get '/s3_direct_post' => 'graffiti#s3_direct_post'
      get '/archive' => 'graffiti#archive'
      put '/delete_image' => 'graffiti#delete_image'
      put '/google_image_capture_date' => 'graffiti#gmaps_streetview_capture_dates'
    end
    resources :comments, only: [:show, :create] do
      member do
        put '/upvote' => 'comments#upvote'
      end
    end

    member do
      put '/upvote' => 'graffiti#upvote'
    end
  end

  post "/auth/facebook", to: "users#create_from_facebook"
  get "/auth/facebook/callback", to: "users#facebook_callback"
  get "/from_token", to: "users#from_token"
  delete "/clear_token", to: "users#clear_token"
  get "/get_graffiti", to: "graffiti#index"
  post "/upload", to: "graffiti#create"

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :graffiti, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
