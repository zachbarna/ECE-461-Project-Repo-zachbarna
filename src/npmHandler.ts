import axios from 'axios';

export class npmHandler {
    static async processPackage(packageName: string) {
        try {
            console.log('Processing NPM Package:', packageName);
            const metaData = await this.fetchNpmPackageMetadata(packageName);
            //console.log('Processed NPM Package:', metaData);
            return metaData;  // Return metadata so it can be used by other components
        } catch (error) {
            console.error('Error processing NPM package.');
            throw error;
        }
    }

    // Fetches metadata for the package, including name, version, maintainers, dependencies, and license
    private static async fetchNpmPackageMetadata(packageName: string) {
        console.log(`Fetching metadata for package: ${packageName}`);
        const url = `https://registry.npmjs.org/${packageName}`;

        try {
            const response = await axios.get(url);
            const data = response.data;

            // Extract metadata
            const metaData = {
                name: this.getName(data),
                version: this.getVersion(data),
                maintainers: this.getMaintainers(data),
                dependencies: this.getDependencies(data),
                license: this.getLicense(data),
                gitUrl: this.getGitRepositoryUrl(data)
            };

            return metaData;
        } catch (error) {
            console.error('Error fetching metadata');
            throw error;
        }
    }

    // Extract the package name
    private static getName(data: any) {
        return data.name || 'Unknown';
    }

    // Extract the latest version of the package
    private static getVersion(data: any) {
        return data['dist-tags']?.latest || 'Unknown';
    }

    // Extract the maintainers of the package
    private static getMaintainers(data: any) {
        return data.maintainers ? data.maintainers.map((m: any) => m.name) : [];
    }

    // Extract the dependencies of the package
    private static getDependencies(data: any) {
        return data.versions[data['dist-tags'].latest]?.dependencies || {};
    }

    // Extract the license information of the package
    private static getLicense(data: any) {
        return data.license || 'Unknown';
    }

    //extract gitUrl if present
    private static getGitRepositoryUrl(data: any) {
        if (data.repository && data.repository.url) {
            return data.repository.url.replace(/^git\+/, '').replace(/\.git$/, ''); //clean url
        }
        return 'No repository URL found';
    }
}
