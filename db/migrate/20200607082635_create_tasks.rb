class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :name, null: false
      t.integer :status, null: false, default: 1
      t.date :due_on, null: false
      t.timestamps
    end
  end
end
