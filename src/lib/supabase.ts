import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, Course, Lesson } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Real client or safe fallback placeholder
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://aifuture-placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

// Helper: Upsert profile to Supabase `profiles` table
export async function upsertSupabaseProfile(user: User): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    // Graceful offline/local mode
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        phone_number: user.phoneNumber,
        email: user.email,
        telegram_handle: user.telegramHandle,
        role: user.role,
        status: user.status,
        avatar_url: user.avatarUrl,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase profile sync warning:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Supabase upsert error:', message);
    return { success: false, error: message };
  }
}

// Helper: Fetch profiles from Supabase
export async function fetchSupabaseProfiles(): Promise<User[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((p) => ({
      id: p.id,
      firstName: p.first_name || 'Foydalanuvchi',
      lastName: p.last_name || '',
      phoneNumber: p.phone_number || '',
      email: p.email || '',
      telegramHandle: p.telegram_handle || '',
      role: (p.role === 'admin' ? 'admin' : 'student') as 'admin' | 'student',
      status: (p.status === 'approved' ? 'approved' : p.status === 'rejected' ? 'rejected' : 'pending') as 'pending' | 'approved' | 'rejected',
      avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: (p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
      bio: p.bio || '',
    }));
  } catch (err) {
    console.warn('Could not fetch Supabase profiles:', err);
    return null;
  }
}

// Helper: Save/Sync course to Supabase `courses` table
export async function upsertSupabaseCourse(course: Course): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const { error } = await supabase.from('courses').upsert({
      id: course.id,
      title: course.title,
      category: course.category,
      level: course.level,
      duration: course.duration,
      lessons_count: course.lessonsCount,
      rating: course.rating,
      instructor: course.instructor,
      description: course.description,
      thumbnail: course.thumbnail,
      status: course.status,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.warn('Course sync error:', err);
    return false;
  }
}

// Helper: Save lesson into Supabase `lessons` table
export async function upsertSupabaseLesson(courseId: string, courseName: string, lesson: Lesson): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const { error } = await supabase.from('lessons').upsert({
      id: lesson.id,
      course_id: courseId,
      course_name: courseName,
      title: lesson.title,
      description: lesson.description || '',
      duration: lesson.duration,
      bunny_video_id: lesson.bunnyVideoId || '',
      library_id: lesson.libraryId || '',
      video_url: lesson.videoUrl || null,
      video_name: lesson.videoName || null,
      pdf_url: lesson.pdfUrl || null,
      pdf_name: lesson.pdfName || null,
      image_url: lesson.imageUrl || null,
      image_name: lesson.imageName || null,
      attachments: lesson.attachments || [],
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch (err) {
    console.warn('Lesson sync error:', err);
    return false;
  }
}

// Helper: Fetch live courses from Supabase
export async function fetchSupabaseCourses(): Promise<Course[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: coursesData, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (coursesError || !coursesData || coursesData.length === 0) return null;

    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*');

    return coursesData.map((c) => {
      const courseLessons: Lesson[] = (lessonsData || [])
        .filter((l) => l.course_id === c.id)
        .map((l) => ({
          id: l.id,
          title: l.title,
          duration: l.duration || '15 daqiqa',
          isCompleted: false,
          bunnyVideoId: l.bunny_video_id || undefined,
          libraryId: l.library_id || undefined,
          videoUrl: l.video_url || undefined,
          videoName: l.video_name || undefined,
          pdfUrl: l.pdf_url || undefined,
          pdfName: l.pdf_name || undefined,
          imageUrl: l.image_url || undefined,
          imageName: l.image_name || undefined,
          attachments: l.attachments || undefined,
          description: l.description || '',
          courseName: c.title,
        }));

      return {
        id: c.id,
        title: c.title,
        category: c.category || 'Dasturlash',
        level: c.level || 'Boshlang\'ich',
        duration: c.duration || '20 soat',
        lessonsCount: courseLessons.length || c.lessons_count || 1,
        studentsCount: c.students_count || 0,
        rating: Number(c.rating) || 5.0,
        instructor: c.instructor || 'AI Future Mentor',
        description: c.description || '',
        thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        status: c.status || 'active',
        lessons: courseLessons.length > 0 ? courseLessons : [
          {
            id: `l-${c.id}-1`,
            title: '1-Dars: Kirish va Asosiy tushunchalar',
            duration: '20 daqiqa',
            isCompleted: false,
            bunnyVideoId: 'b-vid-intro',
            libraryId: '384729',
            description: `${c.title} kursi bo'yicha kirish darsi.`,
            courseName: c.title,
          }
        ],
      };
    });
  } catch (err) {
    console.warn('Could not fetch Supabase courses:', err);
    return null;
  }
}

// Profil rasmini (Avatar) Supabase Storage'ga yuklash
// MUHIM: base64'ga tushib qolish endi qilinmaydi — chunki:
//  1) uzun base64 satr Firestore'dagi avatarUrl uzunlik chegarasidan (500) oshib ketadi
//     va yozuv sokin (silently) rad etiladi;
//  2) F5'dan keyin ham muammo qaytarilaveradi.
// Shu sababli xatolik bo'lsa, aniq xato qaytariladi va foydalanuvchiga ko'rsatiladi.
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase ulanmagan — profil rasmini saqlab bo'lmadi.");
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) {
    console.warn('Supabase storage upload error:', uploadError.message);
    throw new Error(
      `Rasmni Supabase Storage'ga yuklab bo'lmadi: ${uploadError.message}. "avatars" bucket mavjudligini va ruxsatlarini tekshiring.`
    );
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  if (!data?.publicUrl) {
    throw new Error("Rasm yuklandi, lekin ochiq havola (public URL) olinmadi.");
  }

  return data.publicUrl;
}

// Dars materiallarini (video, pdf, rasm, qo'shimcha fayllar) Supabase Storage'ga yuklash
// folder: 'videos' | 'pdfs' | 'images' | 'attachments' — bucket ichidagi papka nomi
export async function uploadLessonMedia(
  file: File,
  folder: 'videos' | 'pdfs' | 'images' | 'attachments'
): Promise<{ url: string; usedFallback: boolean; error?: string }> {
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const safeBase = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '_')
        .slice(0, 60);
      const filePath = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${safeBase}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('lesson-media')
        .upload(filePath, file, { upsert: true, contentType: file.type || undefined });

      if (!uploadError) {
        const { data } = supabase.storage.from('lesson-media').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl, usedFallback: false };
        }
      } else {
        console.warn('Supabase lesson-media upload error:', uploadError.message);
        // Katta fayllar (video kabi) uchun base64 fallback ishlamaydi va foydalanuvchiga
        // aniq xato ko'rsatish kerak, aks holda F5'da fayl yana yo'qoladi.
        return { url: '', usedFallback: false, error: uploadError.message };
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.warn('Supabase lesson-media upload exception:', message);
      return { url: '', usedFallback: false, error: message };
    }
  }

  // Supabase umuman ulanmagan bo'lsa: kichik fayllar uchun base64'ga tushiramiz,
  // katta fayllar uchun (>3MB) xato qaytaramiz, chunki base64 F5'da ishlamaydi va
  // localStorage/DB'ga sig'maydi.
  if (file.size > 3 * 1024 * 1024) {
    return {
      url: '',
      usedFallback: false,
      error: "Supabase ulanmagan va fayl hajmi katta — yuklab bo'lmadi.",
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve({ url: reader.result as string, usedFallback: true });
    reader.onerror = () => resolve({ url: '', usedFallback: false, error: 'Faylni o\'qib bo\'lmadi.' });
    reader.readAsDataURL(file);
  });
}

// Profil ma'lumotlarini bazada yangilash
export async function updateUserProfile(
  userId: string, 
  updates: { first_name?: string; last_name?: string; phone_number?: string; avatar_url?: string }
) {
  if (isSupabaseConfigured) {
    try {
      // upsert: agar profil hali mavjud bo'lmasa yaratadi, mavjud bo'lsa yangilaydi.
      // Oldingi .update() faqat yozuv mavjud bo'lgandagina ishlardi, aks holda
      // hech narsa saqlanmasdi (jim xato).
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updates })
        .select()
        .single();

      if (!error && data) return data;
      if (error) {
        console.warn('Supabase profile update warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase profile update exception:', e);
    }
  }

  return { id: userId, ...updates };
}
