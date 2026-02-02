const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

async function testNotionConnection() {
    console.log('🔍 TEST CONNEXION NOTION (DEBUG AVANCÉ)\n');
    console.log('================================================\n');

    const apiKey = process.env.NOTION_API_KEY;
    const dbId = process.env.NOTION_DATABASE_ID;

    console.log('📋 VARIABLES D\'ENVIRONNEMENT :');
    console.log('NOTION_API_KEY:', apiKey ? '✅ ' + apiKey.substring(0, 15) + '...' : '❌ MANQUANTE');
    console.log('NOTION_DATABASE_ID:', dbId || '❌ MANQUANTE');
    console.log('\n');

    if (!apiKey || !dbId) {
        console.error('❌ Variables manquantes');
        return;
    }

    try {
        // Test 1: Vérifier les permissions de l'intégration
        console.log('📊 TEST 1 : Vérification de l\'intégration');

        const me = await notion.users.me({});
        console.log('✅ Intégration identifiée:');
        console.log('   Nom:', me.name);
        console.log('   Type:', me.type);
        console.log('\n');

    } catch (err) {
        console.log('⚠️  Impossible de récupérer les infos:', err.message);
        console.log('\n');
    }

    try {
        // Test 2: Chercher toutes les data_sources accessibles
        console.log('📊 TEST 2 : Recherche de TOUTES les data sources accessibles');

        const searchResult = await notion.search({
            filter: { property: 'object', value: 'data_source' }
        });

        console.log(`Nombre de data sources trouvées: ${searchResult.results.length}`);
        console.log('');

        searchResult.results.forEach((ds, i) => {
            console.log(`  ${i + 1}. ID: ${ds.id}`);
            console.log(`     Titre: ${ds.title?.[0]?.plain_text || 'Sans titre'}`);
            if (ds.properties) {
                console.log(`     Propriétés: ${Object.keys(ds.properties).join(', ')}`);
            }
            console.log('');
        });

    } catch (err) {
        console.log('⚠️  Recherche data_source:', err.message);

        // Essayer sans filtre
        console.log('\n📊 TEST 2b : Recherche SANS filtre');
        try {
            const searchAll = await notion.search({});
            console.log(`Nombre d'objets trouvés: ${searchAll.results.length}`);

            searchAll.results.forEach((obj, i) => {
                console.log(`  ${i + 1}. Type: ${obj.object}, ID: ${obj.id}`);
                if (obj.title) {
                    console.log(`     Titre: ${obj.title?.[0]?.plain_text || 'N/A'}`);
                }
                if (obj.properties) {
                    console.log(`     Props: ${Object.keys(obj.properties).join(', ')}`);
                }
            });
            console.log('');
        } catch (e) {
            console.log('❌ Recherche sans filtre:', e.message);
        }
    }

    // Test 3: Récupérer la database directement
    console.log('\n📊 TEST 3 : Récupération Database directe');
    console.log(`ID: ${dbId}`);

    try {
        const database = await notion.databases.retrieve({
            database_id: dbId,
        });

        console.log('✅ Database trouvée: ' + (database.title?.[0]?.plain_text || 'Sans titre'));
        console.log('   URL:', database.url);

        if (database.properties && Object.keys(database.properties).length > 0) {
            console.log('\n📋 PROPRIÉTÉS DISPONIBLES :');
            Object.keys(database.properties).forEach(name => {
                const prop = database.properties[name];
                console.log(`  • "${name}" → ${prop.type}`);
            });
        } else {
            console.log('\n❌ Propriétés NON accessibles dans la réponse retrieve');
        }
    } catch (e) {
        console.log('❌ Erreur retrieve:', e.message);
    }

    // Test 4: Essayer de créer une page directement (force brute)
    console.log('\n📊 TEST 4 : Création page directe (détection propriétés)');

    const titleCandidates = ['Name', 'Nom', 'Title', 'Titre', 'Identité', 'Lead', 'Contact'];

    for (const titleName of titleCandidates) {
        try {
            const result = await notion.pages.create({
                parent: { database_id: dbId },
                properties: {
                    [titleName]: { title: [{ text: { content: '🧪 TEST AUTO - À SUPPRIMER' } }] }
                }
            });

            console.log(`\n✅ SUCCÈS ! Propriété title = "${titleName}"`);
            console.log('   URL:', result.url);
            console.log('   ⚠️  VA SUPPRIMER CETTE ENTRÉE TEST SUR NOTION');

            // Maintenant qu'on a trouvé, récupérons les propriétés de la page créée
            console.log('\n� PROPRIÉTÉS DE LA PAGE CRÉÉE :');
            if (result.properties) {
                Object.keys(result.properties).forEach(name => {
                    const prop = result.properties[name];
                    console.log(`  • "${name}" → ${prop.type}`);
                });
            }

            console.log('\n================================================');
            console.log('🎉 CONNEXION NOTION FONCTIONNELLE !');
            console.log('================================================');
            return;

        } catch (err) {
            if (err.code !== 'validation_error') {
                console.log(`❌ Erreur avec "${titleName}":`, err.message);
            }
            // Continuer avec le prochain candidat
        }
    }

    console.log('❌ Aucun nom de propriété title n\'a fonctionné');
    console.log('   L\'intégration n\'a probablement pas les permissions d\'écriture');

    console.log('\n================================================');
    console.log('FIN DU DIAGNOSTIC');
    console.log('================================================\n');
}

testNotionConnection();
