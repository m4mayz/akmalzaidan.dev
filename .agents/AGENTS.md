# TypeScript Rules

1. DILARANG KERAS menggunakan tipe data 'any'.
2. Setiap kali fungsi menerima atau mengembalikan data berupa objek, array of objects, JSON, atau payload API, Anda WAJIB membuat definisi 'interface' atau 'type alias' yang spesifik dan detail untuk struktur data tersebut.
3. Jangan biarkan properti objek di dalam interface menggunakan tipe implisit. Setiap properti harus didefinisikan tipenya (string, number, boolean, array, dll).
4. Jika struktur data bersifat opsional, gunakan optional chaining (?.) atau tanda tanya (?) pada properti interface, bukan mengubah tipe data menjadi 'any'.

Contoh yang SALAH:
```typescript
function handleUser(data: any) { ... }
```

Contoh yang BENAR dan WAJIB Anda ikuti:
```typescript
interface UserPayload {
  id: string;
  name: string;
  email: string;
  age?: number;
}
function handleUser(data: UserPayload) { ... }
```
