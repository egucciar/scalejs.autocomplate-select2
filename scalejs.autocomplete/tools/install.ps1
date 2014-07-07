param($installPath, $toolsPath, $package, $project)

$project |
	Add-Paths "{
		'scalejs.autocomplete' : 'Scripts/scalejs.autocomplete-$($package.Version)',
		'jquery.better-autocomplete': 'Scripts/jquery.better-autocomplete'
	}" |
	Add-Shims "{
		'jquery.better-autocomplete': {
			'deps': ['jQuery']
		}
	}" |
	Add-ScalejsExtension 'scalejs.autocomplete' |
	Out-Null