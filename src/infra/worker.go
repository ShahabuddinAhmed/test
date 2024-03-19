package main

import (
    "fmt"
    "sync"
    "time"
)

// User represents user data
type User struct {
    ID    int
    Name  string
    Email string
}

// Database simulates a database
type Database struct {
    mu    sync.Mutex
    users map[int]User
}

// NewDatabase creates a new Database instance
func NewDatabase() *Database {
    return &Database{
        users: make(map[int]User),
    }
}

// CRUD operations

func (db *Database) CreateUser(user User) {
    db.mu.Lock()
    defer db.mu.Unlock()
    db.users[user.ID] = user
}

func (db *Database) ReadUser(userID int) (User, bool) {
    db.mu.Lock()
    defer db.mu.Unlock()
    user, ok := db.users[userID]
    return user, ok
}

func (db *Database) UpdateUser(user User) {
    db.mu.Lock()
    defer db.mu.Unlock()
    db.users[user.ID] = user
}

func (db *Database) DeleteUser(userID int) {
    db.mu.Lock()
    defer db.mu.Unlock()
    delete(db.users, userID)
}

// Worker simulates a worker that generates summary statistics
func Worker(db *Database) {
    ticker := time.NewTicker(5 * time.Second)
    defer ticker.Stop()
    for {
        select {
        case <-ticker.C:
            db.mu.Lock()
            fmt.Println("Summary statistics:")
            fmt.Println("Total users:", len(db.users))
            db.mu.Unlock()
        }
    }
}

func main() {
    db := NewDatabase()

    // Start worker goroutine
    go Worker(db)

    // Perform CRUD operations concurrently
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(userID int) {
            defer wg.Done()
            user := User{
                ID:    userID,
                Name:  fmt.Sprintf("User%d", userID),
                Email: fmt.Sprintf("user%d@example.com", userID),
            }
            db.CreateUser(user)
            time.Sleep(time.Duration(userID) * time.Second) // Simulate processing time
            updatedUser, _ := db.ReadUser(userID)
            updatedUser.Name = "UpdatedName"
            db.UpdateUser(updatedUser)
            time.Sleep(time.Duration(userID) * time.Second) // Simulate processing time
            db.DeleteUser(userID)
        }(i)
    }

    wg.Wait()
    fmt.Println("All CRUD operations completed.")
    // Wait indefinitely
    select {}
}
