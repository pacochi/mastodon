class AddIndexAccountsOnUri < ActiveRecord::Migration[5.0]
  def change
    add_index :accounts, :uri
  end
end
<<<<<<< HEAD

=======
>>>>>>> 8963f8c3c2630bfcc377a5ca0513eef5a6b2a4bc
