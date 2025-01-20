using Microsoft.EntityFrameworkCore;
using educationPlatformApi.Models;

namespace educationPlatformApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Tablolar
        public DbSet<Course> Courses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<FeedBack> Feedbacks { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<CourseRating> CourseRatings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(
                new Category { CategoryID = 1, Name = "HTML", Url = "html" },
                new Category { CategoryID = 2, Name = "CSS", Url = "css" },
                new Category { CategoryID = 3, Name = "Javascript", Url = "javascript" },
                new Category { CategoryID = 4, Name = "React", Url = "react" },
                new Category { CategoryID = 5, Name = "Angular", Url = "angular" },
                new Category { CategoryID = 6, Name = "Java", Url = "java" },
                new Category { CategoryID = 7, Name = "C#", Url = "csharp" },
                new Category { CategoryID = 8, Name = "PHP", Url = "php" },
                new Category { CategoryID = 9, Name = "Python", Url = "python" },
                new Category { CategoryID = 10, Name = "SQL", Url = "sql" },
                new Category { CategoryID = 11, Name = "Asp.Net Core", Url = "aspnetcore" },
                new Category { CategoryID = 12, Name = "Swift", Url = "swift" },
                new Category { CategoryID = 13, Name = "Kotlin", Url = "kotlin" },
                new Category { CategoryID = 14, Name = "C++", Url = "cplusplus" }
            );

            // Kurs - Kategori
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Category)
                .WithMany(c => c.Courses)
                .HasForeignKey(c => c.CategoryID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde kategoriyle ilişkili kurslar silinsin

            // Kurs - Eğitmen
            modelBuilder.Entity<Course>()
                .HasOne(c => c.Instructor)
                .WithMany(i => i.Courses)
                .HasForeignKey(c => c.InstructorID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde eğitmenle ilişkili kurslar silinsin

            // Kayıt - Kullanıcı
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Student)
                .WithMany(u => u.Enrollments)
                .HasForeignKey(e => e.StudentID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde, kayıtlı öğrenciler de silinsin

            // Kayıt - Kurs
            modelBuilder.Entity<Enrollment>()
                .HasOne(e => e.Course)
                .WithMany(c => c.Enrollments)
                .HasForeignKey(e => e.CourseID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde ilgili kayıtlar silinsin

            // Geri Bildirim - Eğitmen
            modelBuilder.Entity<FeedBack>()
                .HasOne(f => f.Instructor)
                .WithMany(i => i.Feedbacks)
                .HasForeignKey(f => f.InstructorID)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false); // Eğitmenle ilişkilendirilen geri bildirim silinsin

            // Geri Bildirim - Kurs
            modelBuilder.Entity<FeedBack>()
                .HasOne(f => f.Course)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.CourseID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde geri bildirimler silinsin

            // Yorum - Kurs
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Course)
                .WithMany(c => c.Comments)
                .HasForeignKey(c => c.CourseID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde yorumlar silinsin

            // Yorum - Geri Bildirim
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Feedback)
                .WithMany(f => f.Comments)
                .HasForeignKey(c => c.FeedbackID)
                .OnDelete(DeleteBehavior.Cascade); // Geri bildirim silindiğinde yorumlar silinsin

            // Yorum - Kullanıcı
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Student)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserID)
                .OnDelete(DeleteBehavior.NoAction); // Kullanıcı silindiğinde yorum silinmesin (isteğe bağlı)

            // User ve türetilmiş sınıfların (Student, Instructor) ilişkisini yapılandırma
            modelBuilder.Entity<Student>()
                .HasBaseType<User>();
            modelBuilder.Entity<Instructor>()
                .HasBaseType<User>();

            modelBuilder.Entity<User>()
                .HasDiscriminator<string>("PlatformUsage")
                .HasValue<Student>("student")
                .HasValue<Instructor>("instructor");

            // CourseRating
            modelBuilder.Entity<CourseRating>(entity =>
            {
                entity.HasKey(e => e.RatingID); // Primary Key

                // Rating alanı zorunlu ve varsayılan değeri 1
                entity.Property(e => e.Rating)
                    .IsRequired()
                    .HasDefaultValue(1);

                // Course ile ilişki
                entity.HasOne(e => e.Course)
                    .WithMany(c => c.Ratings)
                    .HasForeignKey(e => e.CourseID)
                    .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde o kursun rating'leri de silinsin

                // Student ile ilişki
                entity.HasOne(e => e.Student)
                    .WithMany(s => s.Ratings)
                    .HasForeignKey(e => e.StudentID)
                    .OnDelete(DeleteBehavior.Cascade); // Öğrenci silindiğinde rating'leri de silinsin
            });

            // Course - Rating ilişkisi
            modelBuilder.Entity<Course>()
                .HasMany(e => e.Ratings)
                .WithOne(r => r.Course)
                .HasForeignKey(r => r.CourseID)
                .OnDelete(DeleteBehavior.Cascade); // Kurs silindiğinde rating'ler silinsin
        }
    }
}
