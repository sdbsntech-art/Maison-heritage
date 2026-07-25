<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['username' => env('ADMIN_USERNAME', 'SOKHNA DIBOR DIOUF')],
            [
                'name' => 'SOKHNA DIBOR DIOUF',
                'email' => 'admin@maisonheritage.sn',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'ZAYEL')),
            ]
        );

        if (Product::count() > 0) {
            return;
        }

        foreach ($this->products() as $product) {
            Product::create($product);
        }
    }

    private function products(): array
    {
        return [
            ['name' => 'Oud Al Karam', 'category' => 'Parfums', 'price' => 0, 'description' => 'Un oud intense et enveloppant aux accords de bois de rose et d\'ambre noir.', 'image_url' => 'https://images.unsplash.com/photo-1595425959729-8c53ce44a0cc?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Musc Blanc Impérial', 'category' => 'Parfums', 'price' => 0, 'description' => 'Fragrance épurée aux notes aériennes de musc blanc, fleurs de coton et santal.', 'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Rose d\'Orient', 'category' => 'Parfums', 'price' => 0, 'description' => 'Alliance envoûtante de pétales de rose turque, safran doré et patchouli profond.', 'image_url' => 'https://images.unsplash.com/photo-1588776814546-1ffebb5e0069?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Santal Royal', 'category' => 'Parfums', 'price' => 0, 'description' => 'Bois de santal de Mysore, vanille de Madagascar et noix de coco crémeuse.', 'image_url' => 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Ambre Précieux', 'category' => 'Parfums', 'price' => 0, 'description' => 'Accord ambré riche teinté de benjoin, iris poudré et myrrhe.', 'image_url' => 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Montre Genève Classique', 'category' => 'Montres', 'price' => 0, 'description' => 'Montre ultra-plate à cadran argenté et index dorés, bracelet cuir brun cognac.', 'image_url' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Monaco Noire', 'category' => 'Montres', 'price' => 0, 'description' => 'Boîtier acier satiné, cadran noir ardoise, aiguilles luminescentes.', 'image_url' => 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Prestige Gold', 'category' => 'Montres', 'price' => 0, 'description' => 'Boîtier plaqué or 18 carats, cadran champagne, bracelet milanaise dorée.', 'image_url' => 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Chrono Sport Luxe', 'category' => 'Montres', 'price' => 0, 'description' => 'Chronographe sportif au cadran blanc tricolore et bracelet caoutchouc premium.', 'image_url' => 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Élégance Minimaliste', 'category' => 'Montres', 'price' => 0, 'description' => 'Design épuré, aiguilles fines dorées et boîtier 36mm discret.', 'image_url' => 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Derby Cuir Pleine Fleur', 'category' => 'Chaussures', 'price' => 0, 'description' => 'Richelieu en cuir pleine fleur tanné végétal, finitions Oxford brogue.', 'image_url' => 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Sneaker Prestige Blanc', 'category' => 'Chaussures', 'price' => 0, 'description' => 'Basket premium en cuir nappa blanc, semelle EVA ultra-légère.', 'image_url' => 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Mocassin Tasseled', 'category' => 'Chaussures', 'price' => 0, 'description' => 'Loafer en veau velours bordeaux, glands en cuir tressé.', 'image_url' => 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Bottine Chelsea Noire', 'category' => 'Chaussures', 'price' => 0, 'description' => 'Chelsea boot en cuir lisse noir mat, élastiques latéraux.', 'image_url' => 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Gourmette Or Brossé', 'category' => 'Bracelets', 'price' => 0, 'description' => 'Bracelet maille gourmette en plaqué or 24 carats brossé.', 'image_url' => 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Jonc Argent Ciselé', 'category' => 'Bracelets', 'price' => 0, 'description' => 'Jonc ouvert en argent sterling 925 gravé de motifs berbères.', 'image_url' => 'https://images.unsplash.com/photo-1602752250015-52934bc45613?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Bracelet Pierre Onyx', 'category' => 'Bracelets', 'price' => 0, 'description' => 'Perles d\'onyx noir mat 8mm avec fermoir en acier doré.', 'image_url' => 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Manchette Cuir Tressé', 'category' => 'Bracelets', 'price' => 0, 'description' => 'Manchette large en cuir de veau tressé avec rivets plaqués or.', 'image_url' => 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Chapelet Santal Noble', 'category' => 'Chapelets', 'price' => 0, 'description' => '99 grains de bois de santal naturel taillés à la main.', 'image_url' => 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=85&auto=format&fit=crop', 'is_featured' => true, 'in_stock' => true],
            ['name' => 'Tasbih Corail Rouge', 'category' => 'Chapelets', 'price' => 0, 'description' => 'Chapelet en corail naturel rouge 33 grains, fermoir serti de turquoise.', 'image_url' => 'https://images.unsplash.com/photo-1576186726115-4d51596775d1?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Masbaha Nacre & Or', 'category' => 'Chapelets', 'price' => 0, 'description' => '99 grains de nacre blanche irisée serties d\'or.', 'image_url' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
            ['name' => 'Ceinture Cuir Milano', 'category' => 'Autre', 'price' => 0, 'description' => 'Ceinture cuir pleine fleur 3,5cm, boucle ardillon plaquée or.', 'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=85&auto=format&fit=crop', 'is_featured' => false, 'in_stock' => true],
        ];
    }
}
