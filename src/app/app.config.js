function appConfig($stateProvider, $urlRouterProvider, $translateProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      template: '<app></app>',
    });

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });

  $translateProvider.translations('en', {
    downloadCv: 'Download my CV',
    downloadLink: 'http://www.justinweb.pro/download/cv?lang=eng',
    heroText: 'I’m a <em>UI</em>, <em>UX</em> and <em>Front-End</em> Designer &amp; Developer seeking to change the world with my art.',
    heroName: 'name >>  ',
    heroEmail: 'email >> ',
    heroCell: 'cell >>  ',
    experiences: 'Experiences',
    competencies: 'Competencies',
    competenciesWindowTitle: 'competencies.html',
    technologies: 'Technologies',
    technologiesWindowTitle: 'technologies.html',
  });

  $translateProvider.translations('fr', {
    downloadCv: 'Télécharger mon CV',
    downloadLink: 'http://www.justinweb.pro/download/cv?lang=fr',
    heroText: 'Je suis un <em>développeur</em> et designer <em>UX</em> et <em>UI</em> cherchant à changer le monde avec mon art.',
    heroName: 'nom >>        ',
    heroEmail: 'courriel >>   ',
    heroCell: 'cellulaire >> ',
    experiences: 'Expériences',
    competencies: 'Compétences',
    competenciesWindowTitle: 'compétences.html',
    technologies: 'Technologies',
    technologiesWindowTitle: 'technologies.html',
  });

  $translateProvider.useSanitizeValueStrategy('escapeParameters');
  $translateProvider.determinePreferredLanguage();
}

appConfig.$inject = [
  '$stateProvider',
  '$urlRouterProvider',
  '$translateProvider',
  '$locationProvider',
];

export default appConfig;
