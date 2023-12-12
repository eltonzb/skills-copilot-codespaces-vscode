function skillsMember() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      scope.member.skills = scope.member.skills || [];

      scope.$watch('member.skills', function() {
        scope.skills = scope.member.skills;
      }, true);

      scope.addSkill = function() {
        scope.member.skills.push('');
      };

      scope.removeSkill = function(index) {
        scope.member.skills.splice(index, 1);
      };
    },
    templateUrl: 'assets/templates/member/skills.html'
  };
}